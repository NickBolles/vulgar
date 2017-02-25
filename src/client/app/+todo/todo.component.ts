import { Component } from '@angular/core';

import { TodoService } from './todo.service';

// We `import` `http` into our `TodoService` but we can only
// specify providers within our component
import { Http } from '@angular/http';

// Import NgFor directive
import { NgFor } from '@angular/common';

// Create metadata with the `@Component` decorator
@Component({
  // HTML tag for specifying this component
  selector: 'todo',
  // Let Angular 2 know about `Http` and `TodoService`
  providers: [
    TodoService
  ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './todo.template.html'
})
export class TodoComponent {

  // Initialize our `todoData.text` to an empty `string`
  todoData = {
    text: ''
  };

  private todos: Array<TodoComponent> = [];

  constructor(public todoService: TodoService) {
      // Initialize our `todos` by pinging the `api`
      this.getTodos();
  }

  getTodos() {
    this.todoService.getAll()
      .subscribe((res) => {
          // Populate our `todo` array with the `response` data
          this.todos = res;
      });
  }

  createTodo() {
    this.todoService.createTodo(this.todoData)
      .subscribe((res) => {
        // Push the returned `todo` item to our array of todo items
        this.todos.push(res);
        // Repopulate the `todo` data from server just in case
        this.getTodos();
        // Reset `todo` input
        this.todoData.text = '';
      }, (error) => {
        console.log(error);
        // TODO: Add alerts
        alert('Failed to create todo! Please try again!');
      });
  }

  deleteTodo(id) {
    this.todoService.deleteTodo(id)
      .subscribe((res) => {
        console.log(res.status);
        if (res.status === 204) {
          this.getTodos();
        } else {
          // TODO: Add alerts
          alert('Failed to delete todo! Please try again!');
        }
      });
  }
}
