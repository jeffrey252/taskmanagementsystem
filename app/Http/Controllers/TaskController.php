<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $orderByDate = $request->get('order');
        $search = $request->get('search');
        $tasks = Task::select('id', 'name','status', 'created_at');
        if (!is_null($search)) {
            $tasks->where('name','LIKE',"%{$search}%");
        }
        if (!is_null($orderByDate)) {
            $tasks->orderByDesc('created_at');
        }
        return $tasks->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required',
            'status'=>'required',
            // 'image'=>'required|image'
        ]);

        try{
            // $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
            // Storage::disk('public')->putFileAs('task/image', $request->image,$imageName);
            Task::create($request->post());//+['image'=>$imageName]);
            // Task::create($request->post()+['image'=>$imageName]);

            return response()->json([
                'message'=>'Task Created Successfully!!'
            ]);
        }catch(\Exception | \Throwable $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=> $e->getMessage()//'Something goes wrong while creating a task!!'
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return response()->json([
            'task'=>$task
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'name'=>'required',
            'status'=>'required',
            'image'=>'nullable'
        ]);

        try{

            $task->fill($request->post())->update();

            if($request->hasFile('image')){

                // remove old image
                if($task->image){
                    $exists = Storage::disk('public')->exists("task/image/{$task->image}");
                    if($exists){
                        Storage::disk('public')->delete("task/image/{$task->image}");
                    }
                }

                $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('task/image', $request->image,$imageName);
                $task->image = $imageName;
                $task->save();
            }

            return response()->json([
                'message'=>'Task Updated Successfully!!'
            ]);

        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while updating a task!!'
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        try {
            if($task->image){
                $exists = Storage::disk('public')->exists("task/image/{$task->image}");
                if($exists){
                    Storage::disk('public')->delete("task/image/{$task->image}");
                }
            }
            $task->delete();
            return response()->json([
                'message'=>'Task Deleted Successfully!!'
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Something goes wrong while deleting a task!!'
            ]);
        }
    }
}
