"use client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function Content() {
  const [Render, setRender] = useState(false);
  const [list, setList] = useState([
    {
      _id: "1",
      title: "1",
      sub: [{ subContent: "1번서브" }],
      description: "",
    },
    {
      _id: "2",
      title: "2",
      sub: [{ subContent: "2번서브" }],
      description: "",
    },
  ]);

  const [write, setWrite] = useState({
    title: "",
    content: "",
    description: "",
  });

  const getList = useCallback(async () => {
    const res = await axios.get("/api/list");
    try {
      console.log(res.data);
      setList(res.data.category);
    } catch (err) {
      console.log(err.response);
    }
  }, [list]);

  const pushList = useCallback(async () => {
    const res = await axios.post("/api/list", write);
    try {
      console.log(res.data);
    } catch (err) {
      console.log(err.response);
    }
  }, [write]);

  const handleChange = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const items = [...list]; // 새배열담기
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);

    const res = await axios.post("/api/update", items);
    try {
      console.log(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    // getList();
    setRender(true);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {Render && (
        <DragDropContext onDragEnd={handleDragEnd}>
          {list.map((item) => (
            <Droppable droppableId={item.id.toString()} key={item.id}>
              {(provided) => (
                <div
                  className="parent-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="title">List ID: {item.id}</h3>
                  {item.sub.map((subItem, index) => (
                    <Draggable
                      draggableId={`${item.id}-${index}`}
                      index={index}
                      key={`${item.id}-${index}`}
                    >
                      {(provided) => (
                        <div
                          className="sub-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {subItem.subContent}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      )}
    </div>
  );
}
