"use client";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DetailCard from "./DetailCard";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";

const App = () => {
  const [Render, setRender] = useState(false);
  const [updateRender, setUpdateRender] = useState(false);
  const subInputRef = useRef(null);
  const titleRef = useRef(null);
  const [cardSwitch, setCardSwitch] = useState({
    modal: false,
    parentIdx: 0,
    clickIdx: 0,
    tab_id: "",
    tab: false,
    sub_id: "",
    edit: false,
    title_id: "",
    menu: false,
    menu_id: "",
  });
  const [list, setList] = useState([
    {
      _id: "",
      title: "",
      sub: [{ subContent: "" }],
      description: "",
    },
  ]);

  const [write, setWrite] = useState({
    title: "",
    cardTitle: "",
    sub: [{ subContent: "" }],
    description: "",
    clear: false,
  });
  const [subCard, setSubCard] = useState({
    subContent: "",
  });

  //데이터조회
  const getList = useCallback(async () => {
    const res = await axios.get("/api/list");
    try {
      setList(res.data.category);
    } catch (err) {
      console.log(err.response);
    }
  }, [list, updateRender]);

  //부모카드추가
  const pushList = useCallback(async () => {
    if (write.title === "") {
      return;
    }
    const res = await axios.post("/api/list", write);
    setWrite((state) => ({ ...state, clear: false }));

    try {
      console.log(res.data);
    } catch (err) {
      console.log(err.response);
    } finally {
      setWrite((state) => ({ ...state, clear: true, title: "" }));
    }
  }, [write]);

  //부모카드 수정
  const updateTitle = useCallback(
    async (idx) => {
      const post = {
        api: "title",
        idx,
        title: list[idx].title,
      };
      setUpdateRender(false);
      const res = await axios.post("/api/list", post);
      try {
        console.log(res);
      } catch (err) {
        console.log(err.response);
      } finally {
        setUpdateRender(true);
      }
    },
    [list]
  );

  //서브카드 추가
  const addSubCard = useCallback(
    async (item, idx) => {
      if (subCard.subContent === "") {
        subInputRef.current.focus();
        return;
      }
      const subPost = {
        _id: item._id,
        idx,
        ...subCard,
      };
      const res = await axios.post("/api/add", subPost);
      try {
        console.log(res.data, "서브추가");
        setCardSwitch((state) => ({
          ...state,
          tab: false,
        }));
      } catch (err) {
        console.log(err.response);
      }
    },
    [subCard]
  );
  const deleteData = async (_id, type) => {
    const data = {
      parent: cardSwitch.parentIdx,
      click: cardSwitch.clickIdx,
      api: type,
      _id,
    };
    console.log(data);
    setUpdateRender(false);
    const res = await axios.post(`/api/delete`, data);
    try {
      console.log(res.data, "포스트");
      setCardSwitch((state) => ({ ...state, modal: false }));
    } catch (err) {
      console.log(err.response);
    } finally {
      setUpdateRender(true);
    }
  };

  //서브카드 탭 열닫
  const subCardTab = useCallback(
    (e, item) => {
      e.stopPropagation();
      setCardSwitch((state) => ({
        ...state,
        tab_id: item._id,
        title_id: "",
        menu_id: "",
        tab: true,
      }));
      setSubCard((state) => ({
        ...state,
        subContent: "",
      }));
    },
    [cardSwitch]
  );
  //서브카드 드래그드롭
  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;
    const updatedList = Array.from(list);
    if (source.droppableId === destination.droppableId) {
      // 같은 리스트 내에서의 이동
      const listIndex = source.droppableId;
      const list = updatedList.find((item) => item._id === listIndex);
      const [removed] = list.sub.splice(source.index, 1);
      list.sub.splice(destination.index, 0, removed);
    } else {
      // 다른 리스트로의 이동
      const sourceListIndex = source.droppableId;
      const destListIndex = destination.droppableId;
      const sourceList = updatedList.find(
        (item) => item._id === sourceListIndex
      );
      const destList = updatedList.find((item) => item._id === destListIndex);
      const [removed] = sourceList.sub.splice(source.index, 1);
      destList.sub.splice(destination.index, 0, removed);
    }

    const res = await axios.post("/api/update", updatedList);
    try {
      console.log(res.data, "res");
      // setList(updatedList);
    } catch (err) {
      console.log(err.response);
    }
  };
  const subClick = useCallback(
    (idx, index, _id) => {
      setCardSwitch((state) => ({
        ...state,
        sub_id: _id,
        parentIdx: idx,
        clickIdx: index,
        modal: true,
      }));
    },
    [cardSwitch]
  );
  //엔터
  const handleKeyPress = (event, idx) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter 키를 눌렀습니다.");
      updateTitle(idx);
      setCardSwitch((state) => ({
        ...state,

        edit: false,
      }));
    }
  };

  useEffect(() => {
    getList();
    setRender(true);
  }, [cardSwitch, write.clear, updateRender]);

  return (
    <>
      <div
        onClick={() => {
          setCardSwitch((state) => ({
            ...state,
            tab: false,
            edit: false,
            menu: false,
          }));
        }}
        style={{
          display: "flex",

          paddingTop: "50px",
          display: "flex",
        }}
      >
        {Render && (
          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragStart={() => {
              setCardSwitch((state) => ({
                ...state,
                tab: false,
              }));
            }}
          >
            <div
              style={{
                display: "flex",
                height: "100%",

                width: "100%",
              }}
            >
              {list.map((item, idx) => (
                <Droppable droppableId={item._id} key={item._id}>
                  {(provided) => (
                    <div
                      className="parent-list"
                      onClick={(e) => {
                        setCardSwitch((state) => ({
                          ...state,
                          edit: false,
                        }));
                      }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {cardSwitch.edit && cardSwitch.title_id === item._id ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: " 0px 8px",
                          }}
                        >
                          <input
                            type="text"
                            className="cardTitle"
                            ref={titleRef}
                            onKeyDown={(e) => {
                              handleKeyPress(e, idx);
                            }}
                            value={list[idx].title}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onChange={(e) =>
                              setList((prevList) => {
                                const newList = [...prevList]; // 이전 배열을 복사하여 새로운 배열 생성
                                const updatedItem = {
                                  ...newList[idx], // 이전 요소를 복사하여 새로운 요소 생성
                                  title: e.target.value, // title 변경
                                };
                                newList[idx] = updatedItem; // 새로운 요소로 기존 요소 대체
                                return newList;
                              })
                            }
                          />
                          <span
                            style={{
                              color: "#fff",
                              fontSize: "20px",
                              lineHeight: "10px",
                            }}
                            onClick={() => {
                              updateTitle(idx);
                            }}
                          >
                            <AiOutlineCheckCircle />
                          </span>
                          <span
                            style={{
                              color: "red",
                              fontSize: "20px",
                              lineHeight: "10px",
                            }}
                            onClick={() => {
                              setCardSwitch((state) => ({
                                ...state,
                                edit: false,
                              }));
                            }}
                          >
                            <AiOutlineCloseCircle />
                          </span>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: "flex" }}>
                            <h3
                              className="title"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardSwitch((state) => ({
                                  ...state,
                                  edit: true,
                                  tab_id: "",
                                  menu_id: "",
                                  title_id: item._id,
                                }));
                              }}
                            >
                              {item.title}
                            </h3>
                            <div style={{ position: "relative" }}>
                              <span
                                className="menu"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCardSwitch((state) => ({
                                    ...state,
                                    menu: true,
                                    menu_id: item._id,
                                    tab_id: "",
                                  }));
                                }}
                              >
                                <CiMenuKebab style={{ color: "#fff" }} />
                              </span>
                              {cardSwitch.menu &&
                                cardSwitch.menu_id === item._id && (
                                  <div className="container">
                                    <div>List actions</div>
                                    <div className="menuBar">
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCardSwitch((state) => ({
                                            ...state,
                                            tab: true,
                                            tab_id: item._id,
                                            menu: false,
                                          }));
                                        }}
                                      >
                                        Add card
                                      </div>
                                      {/* <div>Move card</div> */}
                                      <div
                                        onClick={() => {
                                          deleteData(item._id, "card");
                                        }}
                                      >
                                        Delete card
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="">
                        {item.sub.map((subItem, index) => (
                          <Draggable
                            draggableId={subItem._id}
                            index={index}
                            key={subItem._id}
                          >
                            {(provided) => (
                              <>
                                <div
                                  className="sub-item"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => {
                                    const _id = list[idx].sub[index]._id;
                                    subClick(idx, index, _id);
                                  }}
                                >
                                  {subItem.subContent}
                                </div>
                                {provided.placeholder}
                              </>
                            )}
                          </Draggable>
                        ))}
                      </div>

                      {item._id === cardSwitch.tab_id && cardSwitch.tab ? (
                        <>
                          <div
                            className="tabMenu"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <input
                              type="text"
                              ref={subInputRef}
                              placeholder="입력해주세요"
                              value={subCard.subContent}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSubCard((state) => ({
                                  ...state,
                                  subContent: e.target.value,
                                }));
                              }}
                            />
                          </div>
                          <div className="actionBox">
                            <button
                              className="clearbtn"
                              onClick={() => {
                                addSubCard(item, idx);
                              }}
                            >
                              Add
                            </button>
                            <button
                              className="closeBtn"
                              onClick={() => {
                                setCardSwitch((state) => ({
                                  ...state,
                                  tab: false,
                                }));
                              }}
                            ></button>
                          </div>
                        </>
                      ) : (
                        <div
                          className="addBtn"
                          data-id={item._id}
                          onClick={(e) => {
                            subCardTab(e, item);
                          }}
                        >
                          <span className="addicon"></span>
                          <span>Add a card</span>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              ))}
              <div className="parent-list">
                <input
                  type="text"
                  className="addinput"
                  placeholder="Add another list"
                  value={write.title}
                  onChange={(e) => {
                    setWrite((state) => ({
                      ...state,
                      title: e.target.value,
                    }));
                  }}
                />
                <div className="actionBox">
                  <button className="clearbtn" onClick={pushList}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </DragDropContext>
        )}
      </div>
      {cardSwitch.modal && (
        <DetailCard cardSwitch={cardSwitch} setCardSwitch={setCardSwitch} />
      )}
    </>
  );
};

export default App;
