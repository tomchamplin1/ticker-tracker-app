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

        <Modal show={addNewEntry} onHide={() => setAddNewEntry(false)} centered>
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
        </Modal>
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
    var url = "http://localhost:8000/entry/create";
    axios
      .post(url, {
        ingredients: newEntry.ingredients,
        dish: newEntry.dish,
        calories: newEntry.calories,
        fat: parseFloat(newEntry.fat),
      })
      .then((response) => {
        if (response.status === 200) {
          setRefreshData(true);
        }
      });
  }

  function deleteSingleEntry(id) {
    var url = "http://localhost:8000/entry/delete" + id;
    axios.delete(url, {}).then((response) => {
      if (response.status === 200) {
        setRefreshData(true);
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
          setEntries(response.data);
        }
      });
  }
};

export default Entries;
