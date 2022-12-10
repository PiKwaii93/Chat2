<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Entity\User;
use App\Entity\Message;
use App\Repository\ChatRepository;
use App\Repository\MessageRepository;
use Symfony\Component\Mercure\Update;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MessageController extends AbstractController
{
    #[Route('/message/{user}&{sendUser}', name: 'send_message', methods: 'POST')]
    public function pingUser(User $user, User $sendUser, ChatRepository $chatRepository, HubInterface $hub, Request $request, EntityManagerInterface $manager, ManagerRegistry $doctrine, )
    {
        $sendMessage = json_decode($request->getContent());

        $usersIdTab = array($user->getId() , $sendUser->getId());
        sort($usersIdTab);
        $chatRoomId = $usersIdTab[0] . '.' . $usersIdTab[1];
        $chatRoom = $chatRepository->findOneBy(array('topic' => $chatRoomId));

        if(!$chatRoom) {
            $newChatRoom = new Chat();
            $newChatRoom->setTopic($chatRoomId);

            $chatRoom = $newChatRoom;
            $manager->persist($chatRoom);
        }

        $message = new Message;
        $message->setUser($sendUser);
        $message->setDate(new \DateTime());
        $message->setChat($chatRoom);
        $message->setContent($sendMessage);

        $manager = $doctrine->getManager();
        $manager->persist($message);
        $manager->flush();


        $update = new Update(
            [
                "https://example.com/my-private-topic",
                "https://example.com/user/{$user->getId()}/?topic=" . urlencode("https://example.com/my-private-topic")
            ],
            json_encode([
                'message' => $sendMessage
            ]),
            true
        );
        

        $hub->publish($update);

        return $this->json([
            'response' => 'Send !',
            'chatroom' => $chatRoom->getTopic(),
            'chatId' => $chatRoomId,
        ]);
    }

    #[Route('/chat-message/{userId}&{sendUserId}', name: 'chat_message', methods: 'GET')]
    public function getChatMessage(MessageRepository $messageRepository, ChatRepository $chatRepository, User $userId, User $sendUserId, ManagerRegistry $doctrine)
    {
        $usersIdTab = array($userId->getId() , $sendUserId->getId());
        sort($usersIdTab);
        $chatRoomId = $usersIdTab[0] . '.' . $usersIdTab[1];
        $chatRoom = $chatRepository->findOneBy(array('topic' => $chatRoomId));

        $allMessages = $doctrine->getRepository(Message::class)->getAll();

        $specificMessages = $doctrine->getRepository(Message::class)->findByChat($chatRoom);

        $userMessage = $doctrine->getRepository(Message::class)->findByChatUser($chatRoom, $userId);

        $sendUserMessage = $doctrine->getRepository(Message::class)->findByChatUser($chatRoom, $sendUserId);


        for ($i = 0; $i < count($specificMessages); $i++) {
            for($j = 0; $j < count($userMessage); $j++){
                if($specificMessages[$i]["id"] == $userMessage[$j]["id"]){
                    $specificMessages[$i]["user_id"] = $userId->getId();
                }
            }
            for($j = 0; $j < count($sendUserMessage); $j++){
                if($specificMessages[$i]["id"] == $sendUserMessage[$j]["id"]){
                    $specificMessages[$i]["user_id"] = $sendUserId->getId();
                }
            }
        }

        return $this->json([
            'specificMessages' => $specificMessages
        ], 200, [], ['groups' => 'main']);
    }
}