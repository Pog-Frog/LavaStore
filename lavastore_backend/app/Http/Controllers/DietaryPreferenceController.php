<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Repositories\DietaryPreferenceRepository;
use App\Models\DietaryPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DietaryPreferenceController extends Controller
{
    use AuthorizesRequests;
    
    public function __construct(protected DietaryPreferenceRepository $dietaryPreferenceRepository) {
        $this->authorizeResource(DietaryPreference::class, 'dietaryPreference');
    }

    public function index(): JsonResponse {
        $dietaryPreferences = $this->dietaryPreferenceRepository->getAll();

        return response()->json([
            'message' => 'Dietary preferences retrieved successfully',
            'data' => $dietaryPreferences
        ], 200);
    }

    public function store(Request $request): JsonResponse {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $dietaryPreference = $this->dietaryPreferenceRepository->create($request->all());
        if(!$dietaryPreference) {
            return response()->json([
                'message' => 'Dietary preference not created',
            ], 400);
        }

        return response()->json([
            'message' => 'Dietary preference created successfully',
            'data' => $dietaryPreference
        ], 201);
    }

    public function show(string $id): JsonResponse {
        $dietaryPreference = $this->dietaryPreferenceRepository->getById($id);
        if(!$dietaryPreference) {
            return response()->json([
                'message' => 'Dietary preference not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Dietary preference retrieved successfully',
            'data' => $dietaryPreference
        ], 200);
    }

    public function update(Request $request, string $id): JsonResponse {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $dietaryPreference = $this->dietaryPreferenceRepository->update($id, $request->all());
        if(!$dietaryPreference) {
            return response()->json([
                'message' => 'Dietary preference not updated',
            ], 400);
        }

        return response()->json([
            'message' => 'Dietary preference updated successfully',
            'data' => $dietaryPreference
        ], 200);
    }

    public function destroy(string $id): JsonResponse {
        $dietaryPreference = $this->dietaryPreferenceRepository->delete($id);
        if(!$dietaryPreference) {
            return response()->json([
                'message' => 'Dietary preference not deleted',
            ], 400);
        }

        return response()->json([
            'message' => 'Dietary preference deleted successfully',
            'data' => $dietaryPreference
        ], 200);
    }
}
