<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

     /**
      * @return Message[] Returns an array of Message objects
      */
    
    public function findByChat($chat)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.Chat = :Chat')
            ->setParameter('Chat', $chat)
            ->orderBy('m.Date', 'ASC')
            ->getQuery()
            ->getArrayResult()
        ;
    }
    
    public function findByChatUser($chat, $user)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.Chat = :Chat')
            ->setParameter('Chat', $chat)
            ->andWhere('m.User = :User')
            ->setParameter('User', $user)
            ->orderBy('m.Date', 'ASC')
            ->getQuery()
            ->getArrayResult()
        ;
    }

    public function getAll() {
        $qb = $this->createQueryBuilder('u');
        return $qb->getQuery()->getArrayResult();
    }
    

    /*
    public function findOneBySomeField($value): ?Message
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
