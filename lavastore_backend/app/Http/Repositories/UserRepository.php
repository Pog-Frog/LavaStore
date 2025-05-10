<?php

namespace App\Http\Repositories;

use App\Models\User;

class UserRepository
{
    public function createUser(array $data)
    {
        return User::create($data);
    }

    public function getUserById(string $id)
    {
        $user = User::query()->where('id', $id)->first();
        if(!$user) {
            return null;
        }
        return $user;
    }

    public function getUserByEmail(string $email)
    {
        $user = User::query()->where('email', $email)->first();
        if(!$user) {
            return null;
        }
        return $user;
    }

    public function getAllUsers()
    {
        return User::all();
    }

    public function updateUser(string $id, array $data)
    {
        $user = User::query()->where('id', $id)->first();
        if(!$user) {
            return null;
        }
        $user->update($data);
        return $user;
    }

    public function deleteUser(string $id)
    {
        $user = User::query()->where('id', $id)->first();
        if(!$user) {
            return null;
        }
        $user->delete();
        return $user;
    }
}