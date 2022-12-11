<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/user-list', name: 'user_list')]
    public function userList(UserRepository $userRepository)
    {
        return $this->json([
            'users' => $userRepository->findAll()
        ], 200, [], ['groups' => 'main']);
    }

    #[Route('/one-user/{id}', name: 'onse_user')]
    public function oneUser(UserRepository $userRepository, $id)
    {
        return $this->json([
            'user' => $userRepository->findOneBy(array('id' => $id))
        ], 200, [], ['groups' => 'main']);
    }

    #[Route('/QrCode/{JWT}', name: 'qr_code')]
    public function QrCode($JWT)
    {
        return $this->json([
            'JWT' => $JWT
        ], 200, [], ['groups' => 'main']);
    }
}