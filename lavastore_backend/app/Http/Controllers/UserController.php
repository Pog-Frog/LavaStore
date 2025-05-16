<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct(protected UserRepository $userRepository) { }

    public function updateUser(Request $request) {
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . Auth::id(),
            'password' => 'nullable|string|min:8',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        
        $id = Auth::id();

        $user = $this->userRepository->getUserById($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $data = [
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ];

        if($request->hasFile('profile_picture')) {
            Storage::delete($user->profile_picture_url);
            $file = $request->file('profile_picture');
            $path = $file->store('profile_pictures', 'public');
            $data['profile_picture_url'] = Storage::url($path);
        }

        $user = $this->userRepository->updateUser($id, $data);

        if(!$user) {
            return response()->json([
                'message' => 'User not updated'
            ], 400);
        }

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user
        ], 200);

    }
}
