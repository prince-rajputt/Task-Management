import { useEffect, useState } from "react";
import { api } from "../services/api";
import { io } from "socket.io-client";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    api.get("/tasks").then(res => setTasks(res.data));

    socket.on("taskCreated", task => {
      console.log("Socket: taskCreated", task);
      setTasks(prev => [...prev, task]);
    });

    socket.on("taskUpdated", updated => {
      console.log("Socket: taskUpdated", updated);
      setTasks(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );
    });

    socket.on("taskDeleted", id => {
      console.log("Socket: taskDeleted", id);
      setTasks(prev => prev.filter(t => t.id !== Number(id)));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { tasks, setTasks };
};
