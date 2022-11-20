import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import Entries from "./components/Entries";
import Modal from "./components/Modal";

function App() {
  return (
    <div>
      <Header />
      <Entries />
      <Modal />
    </div>
  );
}

export default App;
