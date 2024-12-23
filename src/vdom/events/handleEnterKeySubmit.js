import { toDoList } from "../..";
import { createListItem } from "../components/createListItem";
import { routing } from "../routing/routing";
import { updateGameApp } from "../updateGameApp";

export const handleEnterKeySubmit = (event) => {




  // Early return if the key pressed is not "Enter"
  if (event.key !== "Enter") return;
  const inputContainers = document.querySelectorAll('.input-container');
  // Check if there's only one input
  if (inputContainers.length == 1) {
    const input = inputContainers[0].querySelector('input');
    const todoInputValue = input.value.trim();
    // Early return if the input value is empty
    if (!todoInputValue) return;

    const toDoItem = createListItem(todoInputValue);
    toDoList.push(toDoItem);

    // updateGameApp
    updateGameApp(...toDoList)

    input.value = "";
    
  }
  if (inputContainers.length == 2) {
    const secondInputContainer = inputContainers[1];  // The second input is at index 1

    // Find the child input element within the second input
    const input = secondInputContainer.querySelector('input');

    if (input) {
      const index = toDoList.findIndex(item => item.tagName === "div");

      toDoList[index] = createListItem(input.value)
      updateGameApp(...toDoList)
    };
  }
  
  routing()
};