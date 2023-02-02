<script setup>
  import { ref, onMounted } from 'vue'

  import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'
  import { db } from '@/firebase'

  const todosCollectionRef = collection(db, "todo")
  const todosCollectionQuery = query(todosCollectionRef, orderBy('date', 'desc')) // List to do list based on date / descending order

  const todos = ref ([])

  onMounted (() => {
    onSnapshot(todosCollectionQuery, (querySnapshot) => { // Realtime / firing when there's a change
      const fbTodos = [];
      querySnapshot.forEach((doc) => {
        const todo = {
          id: doc.id,
          content: doc.data().content,
          done: doc.data().done
        }
        fbTodos.push(todo) // Query all the data from firebase
      })
      todos.value = fbTodos // pass the data to 'todos' ref which is being used as loop in our template
    })
  })

  const newToDoContent = ref('') // use as v-model for the add input field
  const editedToDoContent = ref('') // use as v-model for the update input field
  const isEditable = ref(false) // use to either display the actual content <p> or the input text for updating content

  const addTodo = () => {
    addDoc(todosCollectionRef, { //Set of items inside the object to add in firebase database
      content: newToDoContent.value,
      done: false,
      date: Date.now(),
      isEditable: false,
    })
    newToDoContent.value = '' // Reset the add input field v-model
  }

  const deleteTodo = id => {
    deleteDoc(doc(todosCollectionRef, id)) //Copy pasted from firebase documentation, delete specific item base on id
  }

  const saveTodo = id => {
    const index = todos.value.findIndex(todo => todo.id === id)

    updateDoc(doc(todosCollectionRef, id), { //Update specific item inside object base on the id
      content: editedToDoContent.value
    })
  }

  const toggleDone = id => {
    const index = todos.value.findIndex(todo => todo.id === id) //Find the index base on ID

    updateDoc(doc(todosCollectionRef, id), { //Update specific item inside object base on the id
      done: !todos.value[index].done
    })
  }

</script>

<template>
  <main>
    <form @submit.prevent="addTodo">
      <div class="row">
        <input v-model="newToDoContent" type="text" placeholder="Add item">
        <button class="btn-success" :disabled="!newToDoContent">Add</button>
      </div>
    </form>

    <div class="row">
      <div>
        <div
          class="cards"
          :class="{'completed' : todo.done}" 
          v-for="(todo, todo_index) in todos" 
          :key="todo_index">
          
          <p v-if="!todo.isEditable">{{ todo.content }}</p>
          <input 
            v-if="todo.isEditable" 
            v-model="editedToDoContent" 
            type="text" 
            :placeholder="todo.content">

          <div class="options">
            <button
              @click="toggleDone(todo.id)"
              class="btn-success">Done</button>
            <button 
              v-if="!todo.isEditable" 
              @click="todo.isEditable = true" 
              class="btn-success">Update</button>
            <button 
              v-if="todo.isEditable" 
              @click="saveTodo(todo.id)" 
              class="btn-success">Save</button>
            <button 
              @click="deleteTodo(todo.id)" 
              class="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
  background: #f7f7f7;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
main {
  max-width: 400px;
  width: 100%;
  background: #191e3b;
  padding: 20px;
}
.row {
  display: flex;
  grid-gap: 5px;
}
.row > * {
  flex-grow: 1;
}

/*=== BUTTONS ===*/
button {
  cursor: pointer;
  border: none;
  color: #fff;
  border-radius: 3px;
  padding: 0 10px;
  min-height: 30px;
  max-width: 80px;
}
button:hover {
  opacity: .8;
}
.btn-success {
  background:#2e6584;
}
.btn-delete {
  background: #f1304d;
}

/*=== CARDS ===*/
.cards {
  background: #272f46;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  align-items: center;
  position: relative;
  display: flex;
  box-shadow: 1px 1px 8px #0c0e1e;
}
.cards > * {
  flex-grow: 1;
}
.cards .options {
  text-align: right;
}
.cards .options button {
  margin: 3px;
}
.cards p {
  font-size: 20px;
  margin: 0;
  color: #fff;
}


/*=== STATUS ===*/
.completed {
  text-decoration: line-through;
  background: #96c3ba;
}
.completed p {
  color: #000;
}

input {
  outline: 0;
  padding: 10px;
}
</style>