import React, { useState, useEffect } from "react";

import axios from "axios";

import { Button, Form, Modal, Container } from "react-bootstrap";

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
    <div>
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

          <Container>
            <Button class="text-3xl pl-16" onClick={() => setAddNewEntry(true)}>
              Track today's calories
            </Button>
          </Container>

          <Modal
            show={addNewEntry}
            onHide={() => setAddNewEntry(false)}
            centered
          >
            <Modal.Header closeButton>
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
            <Button
              onClick={() => setChangeIngredient({ change: false, id: 0 })}
            >
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
          </Modal>
        </div>
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
