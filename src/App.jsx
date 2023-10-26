import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const Api_Url = "https://653526a9c620ba9358ec3537.mockapi.io/usersTodo/";

  // Adding the todo
  const [todoName, settodoName] = useState("");
  const [todoDescription, settodoDescription] = useState("");
  const [todoStatus, settodoStatus] = useState("");
  const [id, setid] = useState();

  //Filter the Todos
  function getData() {
    let id = document.getElementById("dataView");
    console.log(id.value);
    if (id.value == "1") {
      callGetApi();
    } else if (id.value == "2") {
      callGetApi1();
    } else if (id.value == "3") {
      callGetApi2();
    }
  }

  //Add Todo
  async function addTodo() {
    if ((todoName != "") & (todoDescription != "")) {
      let newTodo = {
        todoName: todoName,
        todoDescription: todoDescription,
        todoStatus: "NotCompleted",
      };

      try {
        let postedJSON = await fetch(Api_Url, {
          method: "POST",
          body: JSON.stringify(newTodo),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        let postedObject = await postedJSON.json();

        console.log("todo Creation Successful!");

        settodoName("");
        settodoDescription("");
        settodoStatus("");
        callGetApi();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please enter the name & Descriptgion");
    }
  }

  //Getting the todo
  const [apiData, setapiData] = useState([]);

  const callGetApi = async () => {
    const resp = await fetch(Api_Url)
      .then((resp) => resp.json())
      .then((data) => data);
    setapiData(resp);
  };
  const callGetApi1 = async () => {
    const resp = await fetch(Api_Url)
      .then((resp) => resp.json())
      .then((data) =>
        data.map((datas) => (datas.todoStatus == "Completed" ? datas : "datas"))
      );
    setapiData(resp);
  };
  const callGetApi2 = async () => {
    const resp = await fetch(Api_Url)
      .then((resp) => resp.json())
      .then((data) =>
        data.map((datas) =>
          datas.todoStatus == "NotCompleted" ? datas : "datas"
        )
      );
    setapiData(resp);
  };

  useEffect(() => {
    callGetApi();
  }, []);

  //Deleting the todo
  function Card({ data }) {
    const [status, setstatus] = useState(data.todoStatus);
    const selectRef = useRef(null);

    const deletTodo = async (id) => {
      fetch(Api_Url + id, {
        method: "DELETE",
      }).then(() => {
        console.log(`post with id ${id} deleted successfully`);
        callGetApi();
      });
    };

    // Change status of todo
    const patchData = async (value, id) => {
      console.log(value, id);

      try {
        let updatedstatus = {
          todoStatus: value.value,
        };
        let postedJSON = await fetch(Api_Url + id, {
          method: "PUT",
          body: JSON.stringify(updatedstatus),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        let postedObject = await postedJSON.json();

        console.log("Post Updated successfully!");
        callGetApi();
      } catch (error) {
        console.log("error creating the post", error);
      }
    };

    //Edit todo
    const EditTodo = ({ id, todoName, todoDescription, todoStatus }) => {
      setid(id);
      settodoName(todoName);
      settodoDescription(todoDescription);
      settodoStatus(todoStatus);
      deletTodo(id);
    };

    if (data != "datas") {
      return (
        <div className="col-md-6 col-lg-4 py-3" id="cardSection">
          <div className="cards rounded p-3 text-start">
            <p className="m-2">
              <b>Name : </b>
              {data.todoName}
            </p>
            <div className="heightDiv">
              <p className="m-1 text-break">
                <b>Description : </b>
                {data.todoDescription}
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-start mt-2">
              <p className="m-1">
                <b>Status : </b>
              </p>
              <select
                className=" cartdselect form-select  w-auto m-1"
                id="select"
                ref={selectRef}
                style={{
                  backgroundColor:
                    status === "Completed" ? "#13AD89" : "#ff8080",
                }}
                onChange={(e) => {
                  setstatus(e.target.value);
                  patchData(e.target, data.id);
                }}
                value={status}>
                <option value="NotCompleted" id="NotCompleted">
                  Not Completed
                </option>
                <option value="Completed" id="Completed">
                  {" "}
                  Completed{" "}
                </option>
              </select>
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <button
                className="edit m-1 rounded "
                onClick={() => {
                  EditTodo(data);
                }}>
                Edit
              </button>
              <button
                className="delete m-1 rounded"
                onClick={() => {
                  deletTodo(data.id);
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container">
      {/* head */}
      <div className="text-center">
        <h1 className="py-5 mt-5" style={{ color: "#13AD89" }}>
          My todo
        </h1>
        <div className="head d-md-flex justify-content-center w-100 ">
          <input
            className="ip w-75 mx-4 rounded form-control"
            maxLength={25}
            type="text"
            value={todoName}
            onChange={(event) => settodoName(event.target.value)}
            placeholder="Todo Name..."
            id="todoName"
          />
          <input
            className="ip w-75 mx-4 rounded form-control"
            maxLength={120}
            type="text"
            value={todoDescription}
            onChange={(event) => settodoDescription(event.target.value)}
            placeholder="Todo Description..."
            id="todoDescription"
          />
          <button className="buttonAdd w-25 mx-4 rounded " onClick={addTodo}>
            Add todo
          </button>
        </div>
        {/* filter Section */}
        <div>
          <div className=" d-flex justify-content-between py-5">
            <h3>My Todos</h3>
            <div className="d-flex d-flex justify-content-end w-auto align-items-center">
              <h3 className="d-inline w-auto px-2">Status Filter :</h3>
              <select
                className=" select form-select d-inline w-auto "
                id="dataView"
                onChange={getData}>
                <option value="1">All </option>
                <option value="2">Completed </option>
                <option value="3">Not Completed </option>
              </select>
            </div>
          </div>
          {/* card section */}
          <div className="row">
            {apiData.map((data,id) => (
              <Card key={id} data={data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
