import React, { useEffect, useState } from "react";
import "./App.css";
import InputField from "./InputField";
import TodoList from "./TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Todo, Task } from "../../../models/models";
import axios from "axios";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [CompletedTodos, setCompletedTodos] = useState<Array<Todo>>([]);

  useEffect(()=> {
    axios.get('http://127.0.0.1:8000/api/tasks')
    .then(res => {
      setTodos(res.data.filter(({task_status_id}: Task) => task_status_id === 1).map(({id, name} : Task) => ({ id:id, todo:name })));
      setCompletedTodos(res.data.filter(({task_status_id}: Task) => task_status_id === 2).map(({id, name} : Task) => ({ id:id, todo:name })));
    });

  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      axios.post(`http://127.0.0.1:8000/api/tasks/create`, {name: todo, task_status_id: 1, arrangement_id: todos.length + 1})
      .then(res => setTodos([...todos, { id: res.data.id, todo: res.data.name }]));
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    let active = todos;
    let complete = CompletedTodos;
    // Source Logic
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }
    

    // Destination Logic
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    axios.patch(`http://127.0.0.1:8000/api/tasks/${add.id}`, {name: add.todo, task_status_id: destination.droppableId === "TodosList" ? 1 : 2, complete, active});

    setCompletedTodos(complete);
    setTodos(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">tasky</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          CompletedTodos={CompletedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
