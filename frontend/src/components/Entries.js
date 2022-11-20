import React, { useState, useEffect } from "react";

import axios from "axios";

import { Button, Form, Container, Modal } from "react-bootstrap";

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [changeEntry, setChangeEntry] = useState({ change: false, id: 0 });
  const [changeIngredient, setChangeIngredient] = useState({
    change: false,
    id: 0,
  });
  const [newIngredientName, setNewIngredientName] = useState("");
  const [addNewEntry, setAddNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    stockid: "",
    name: "",
    price: "",
    company: "",
  });

  useEffect(() => {
    getAllEntries();
  }, []);

  if (refreshData) {
    setRefreshData(false);
    getAllEntries();
  }

  return (
    <div className="p-5 overflow-x-auto relative">
      <div class="overflow-x-auto relative">
        <table class="w-3/4 m-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="py-3 px-6">
                STOCK
              </th>
              <th scope="col" class="py-3 px-6">
                PRICE
              </th>
              <th scope="col" class="py-3 px-6">
                TICKER
              </th>
              <th></th>
            </tr>
          </thead>
          {entries != null &&
            entries.map((entry, i) => (
              <tbody>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {entry.name}
                  </th>
                  <td class="py-4 px-6"> ${entry.price}</td>
                  <td class="py-4 px-6"> {entry.company}</td>
                  <td class="py-4 px-6">
                    <button onClick={() => deleteSingleEntry(entry.stockid)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path
                          fill-rule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          <button
            className="bg-blue-700 rounded-md mt-2 p-2 text-white"
            onClick={() => setAddNewEntry(true)}
          >
            Add +
          </button>
        </table>

        {addNewEntry && (
          <div
            show={addNewEntry}
            onHide={() => setAddNewEntry(false)}
            id="authentication-modal"
            aria-hidden="true"
            class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full"
          >
            <div class="relative w-full max-w-md h-full md:h-auto">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-toggle="authentication-modal"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
                <div class="py-6 px-6 lg:px-8">
                  <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                    Add Entry
                  </h3>
                  <form class="space-y-6" action="#">
                    <div>
                      <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        onChange={(event) => {
                          newEntry.name = event.target.value;
                        }}
                        id="name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="name"
                        required
                      />
                    </div>
                    <div>
                      <label
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                      />
                    </div>
                    <div class="flex justify-between">
                      <div class="flex items-start">
                        <div class="flex items-center h-5">
                          <input
                            id="remember"
                            type="checkbox"
                            value=""
                            class="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                            required
                          />
                        </div>
                        <label
                          for="remember"
                          class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        class="text-sm text-blue-700 hover:underline dark:text-blue-500"
                      >
                        Lost Password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <Modal.Header closeButton>
            <Modal.Title>Add Calorie Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Dish</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newEntry.dish = event.target.value;
                }}
              ></Form.Control>
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newEntry.ingredients = event.target.value;
                }}
              ></Form.Control>
              <Form.Label>Calories</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newEntry.calories = event.target.value;
                }}
              ></Form.Control>
              <Form.Label>Fat</Form.Label>
              <Form.Control
                type="number"
                onChange={(event) => {
                  newEntry.fat = event.target.value;
                }}
              ></Form.Control>
            </Form.Group>
            <Button onClick={() => addSingleEntry()}>Add</Button>
            <Button onClick={() => setAddNewEntry(false)}>Cancel</Button>
          </Modal.Body>
        </Modal>

        <Modal
          show={changeIngredient.change}
          onHide={() => setChangeIngredient({ change: false, id: 0 })}
          centered
        ></Modal>
        <Modal.Header closeButton>
          <Modal.Title>Change Ingredients</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Ingredients</Form.Label>
            <Form.Control
              onChange={(event) => {
                setNewIngredientName(event.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Button onClick={() => changeIngredientForEntry()}>Change</Button>
          <Button onClick={() => setChangeIngredient({ change: false, id: 0 })}>
            Cancel
          </Button>
        </Modal.Body>

        <Modal
          show={changeEntry.change}
          onHide={() => setChangeEntry({ change: false, id: 0 })}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Dish</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newEntry.dish = event.target.value;
                }}
              ></Form.Control>
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newEntry.ingredients = event.target.value;
                }}
              ></Form.Control>
              <Form.Label>Calories</Form.Label>
              <Form.Control
                onChange={(event) => {
                  newEntry.calories = event.target.value;
                }}
              ></Form.Control>
              <Form.Label>Fat</Form.Label>
              <Form.Control
                type="number"
                onChange={(event) => {
                  newEntry.fat = event.target.value;
                }}
              ></Form.Control>
            </Form.Group>
            <Button onClick={() => changeSingleEntry()}>Change</Button>
            <Button onClick={() => setChangeEntry({ change: false, id: 0 })}>
              Cancel
            </Button>
          </Modal.Body>
        </Modal> */}
      </div>
    </div>
  );

  function changeIngredientForEntry() {
    changeIngredient.change = false;
    var url = "http://localhost:8080/ingredient/update/" + changeIngredient.id;
    axios
      .put(url, {
        ingredients: newIngredientName,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setRefreshData(true);
        }
      });
  }

  function changeSingleEntry() {
    changeEntry.change = false;
    var url = "http://localhost:8000/entry/update/" + changeEntry.id;
    axios.put(url, newEntry).then((response) => {
      if (response.status === 200) {
        setRefreshData(true);
      }
    });
  }

  function addSingleEntry() {
    setAddNewEntry(false);
    var url = "http://localhost:8080/api/newstock";
    axios
      .post(url, {
        name: newEntry.name,
        price: parseFloat(newEntry.price),
        company: newEntry.company,
      })
      .then((response) => {
        if (response.status === 200) {
          setRefreshData(true);
        }
      });
  }

  function deleteSingleEntry(id) {
    var url = "http://localhost:8080/api/deletestock/" + id;
    axios.delete(url, {}).then((response) => {
      if (response.status === 200) {
        setRefreshData(true);
        console.log("Successfully deleted entry " + id);
      }
    });
  }

  function getAllEntries() {
    var url = "http://localhost:8080/api/stock";
    axios
      .get(url, {
        responseType: "json",
      })
      .then((response) => {
        if (response.status === 200) {
          var entryList = response.data;
          setEntries(entryList.sort((a, b) => a[1] - b[1]));
        }
      });
  }
};

export default Entries;
