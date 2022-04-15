import React, { useState, useLayoutEffect, useCallback } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";
import { throttle } from "throttle-debounce";
import fetch from "../axios";

export default function AdminPage() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [participantsSearched, setParticipantsSearched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const searchFunc = useCallback(
    throttle(
      500,
      (str) => {
        const reg = new RegExp(`${str}`, "g");
        const arr = participants.filter((item) => item.email.match(reg));
        setParticipantsSearched(arr);
      },
      { noLeading: false, noTrailing: false }
    ),
    [participants]
  );

  useLayoutEffect(() => {
    setParticipantsSearched(participants);
    searchFunc(search);
  }, [search, participants]);

  useLayoutEffect(() => {
    fetch
      .get("/participants")
      .then((res) => {
        setParticipants(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleButtonAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch
      .post("/participants", { email, name })
      .then(async (res) => {
        const checkParticipant = await participants.some(
          (participant) => participant.email === res.data.email
        );

        if (!checkParticipant)
          await setParticipants([...participants, res.data]);
        await setEmail("");
        await setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleButtonAttendance = async (id) => {
    setLoading(true);
    await fetch
      .put(`/participants/${id}`, { status: "participated" })
      .then(async (res) => {
        await setParticipants(
          participants.map((participant) =>
            participant.id == res.data.id ? res.data : participant
          )
        );
        await setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleButtonDelete = async (id) => {
    setLoading(true);
    await fetch
      .delete(`/participants/${id}`)
      .then(async (res) => {
        await setParticipants(participants.filter((p) => p.id !== id));
        await setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Container className="fluid" style={{ minHeight: "100vh" }}>
      <Form onSubmit={handleButtonAdd} className="mt-4">
        <Form.Group
          controlId="formBasicEmail"
          style={{
            display: "flex",
          }}
        >
          <Form.Control
            style={{ maxWidth: "50%" }}
            type="text"
            disabled={loading}
            placeholder="Enter name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Form.Control
            style={{ maxWidth: "50%" }}
            type="email"
            disabled={loading}
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Button type="submit" disabled={loading}>
            Add
          </Button>
        </Form.Group>
      </Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="email"
          disabled={loading}
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </Form.Group>
      <div>
        <h4>Count: {participantsSearched.length}</h4>
      </div>
      <div className="mb-2">
        <h4>
          Participated:{" "}
          {participantsSearched.reduce((sum, participants) => {
            if (participants.status === "participated") {
              return sum + 1;
            } else {
              return sum;
            }
          }, 0)}
        </h4>
      </div>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participantsSearched.map((participant, index) => {
            return (
              <tr key={index}>
                <td>{participant.name}</td>
                <td>{participant.email}</td>
                <td
                  className={
                    (participant.status == "participated" && "text-success") ||
                    null
                  }
                >
                  {participant.status}
                </td>
                <td>
                  <Button
                    disabled={loading}
                    className="bg-danger"
                    onClick={() => {
                      handleButtonDelete(participant.id);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    disabled={loading}
                    className="bg-success"
                    onClick={() => {
                      handleButtonAttendance(participant.id);
                    }}
                  >
                    Attendance
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Container></Container>
    </Container>
  );
}
