<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Message;
use App\Service\CookieHelper;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class PingController extends AbstractController
{
    #[Route('/ping/{user}&{sendMessage}&{sendUser}', name: 'ping_user', methods: 'POST')]
    public function pingUser(User $user, $sendMessage, User $sendUser, HubInterface $hub)
    {
        $update = new Update(
            [
                "https://example.com/my-private-topic",
                "https://example.com/user/{$user->getId()}/?topic=" . urlencode("https://example.com/my-private-topic")
            ],
            json_encode([
                'user' => $user->getUsername(),
                'id' => $user->getId(),
                'sendMessage' => $sendMessage,
                'sendUser' => $sendUser->getUsername()
            ]),
            true
        );

        $hub->publish($update);

        return $this->json([
            'sendMessage' => $sendMessage,
            'sendUser' => $sendUser->getUsername(),
            'test' => $user->getUsername()
        ]);
    }
}