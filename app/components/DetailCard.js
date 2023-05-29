"use client";
import { colorArr } from "@/client/color";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineEdit,
} from "react-icons/ai";
import { MdArrowBackIosNew } from "react-icons/md";

const DetailCard = ({ cardSwitch, setCardSwitch }) => {
  const inputRef = useRef(null);
  const [detailData, setDetailData] = useState({
    description: "",
    comment: "",
    subContent: "",
    _id: "",
    colorEdit: false,
    colorPicker: false,
    titleInput: false,
    checked: false,
    colorGet: false,
    colorId: "",
    label: [],
    edit: false,
  });

  const [colorData, setColorData] = useState({
    idx: "0",
    color: "#164b35",
    text: "",
    textColor: "",
    index: "0",
  });

  const [labelArr, setLabelArr] = useState([]);

  const [rander, setrender] = useState(false);
  const titleRef = useRef(null);
  //데이터조회
  const getData = async () => {
    const res = await axios.get(
      `/api/sub?parent=${cardSwitch.parentIdx}&click=${cardSwitch.clickIdx}`
    );
    try {
      // console.log(res.data, "겟");
      setDetailData((state) => ({
        ...state,
        description: res.data.description,
        subContent: res.data.subContent,
        _id: res.data._id,
        label: res.data.label,
      }));
      // setLabelArr(res.data.label);
      setLabelArr(res.data.labelList);
    } catch (err) {
      console.log(err.response);
    }
  };
  //서브데이터추가
  const saveData = async (type) => {
    const data = {
      sub_id: cardSwitch.sub_id,
      parent: cardSwitch.parentIdx,
      click: cardSwitch.clickIdx,
      description: detailData.description,
      subContent: detailData.subContent,
      api: type,
      colorData: colorData,
    };

    setrender(false);
    const res = await axios.post(`/api/sub`, data);
    try {
      // console.log(res.data, "포스트");
    } catch (err) {
      console.log(err.response);
    } finally {
      setrender(true);
    }
  };
  //라벨리스트추가
  const addlabel = async (type, props) => {
    const data = {
      sub_id: cardSwitch.sub_id,
      parent: cardSwitch.parentIdx,
      click: cardSwitch.clickIdx,
      api: type,
      labelList: props,
    };
    setrender(false);
    const res = await axios.post(`/api/sub`, data);
    try {
      // console.log(res.data, "포스트");
    } catch (err) {
      console.log(err.response);
    } finally {
      setrender(true);
    }
  };
  //데이터 삭제
  const deleteData = async (type) => {
    const data = {
      parent: cardSwitch.parentIdx,
      click: cardSwitch.clickIdx,
      api: type,
      _id: detailData._id,
    };
    setrender(false);
    const res = await axios.post(`/api/delete`, data);
    try {
      console.log(res.data, "포스트");
      setCardSwitch((state) => ({ ...state, modal: false }));
    } catch (err) {
      console.log(err.response);
    } finally {
      setrender(true);
    }
  };

  const back = (e) => setCardSwitch((state) => ({ ...state, modal: false }));
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveData("title");
    }
  };

  useEffect(() => {
    getData();
  }, [rander]);

  return (
    <div className="back" onClick={back}>
      <div
        className="detail"
        onClick={(e) => {
          e.stopPropagation();
          setDetailData((state) => ({ ...state, titleInput: false }));
        }}
      >
        <div className="top">
          <span></span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="text"
              ref={titleRef}
              onKeyDown={handleKeyPress}
              value={detailData.subContent || ""}
              onClick={(e) => {
                e.stopPropagation();
                setDetailData((state) => ({ ...state, titleInput: true }));
              }}
              onChange={(e) => {
                e.stopPropagation();
                setDetailData((state) => ({
                  ...state,
                  subContent: e.target.value,
                  titleInput: true,
                }));
              }}
            />
            {detailData.titleInput && (
              <>
                <span
                  onClick={() => {
                    saveData("title");
                  }}
                  style={{
                    color: "#fff",
                    fontSize: "20px",
                    lineHeight: "10px",
                  }}
                >
                  <AiOutlineCheckCircle />
                </span>
                <span
                  onClick={() => {
                    setrender(false);
                  }}
                  style={{
                    color: "red",
                    fontSize: "20px",
                    lineHeight: "10px",
                  }}
                >
                  <AiOutlineCloseCircle />
                </span>
              </>
            )}
          </div>
          <button
            onClick={back}
            style={{ display: "flex", alignItems: "center" }}
          >
            <AiOutlineClose style={{ fontSize: "40px", color: "#575757" }} />
          </button>
        </div>
        <div className="labels">
          <h3>Labels</h3>
          <div className="flex">
            {labelArr.length !== 0 &&
              labelArr.map((a) => {
                return (
                  <div
                    key={a.idx}
                    style={{ background: a.color, color: a.textColor }}
                  >
                    {a.text}
                  </div>
                );
              })}

            <button
              onClick={() => {
                setDetailData((state) => ({ ...state, colorPicker: true }));
              }}
            ></button>
          </div>
          {detailData.colorPicker && (
            <>
              <div
                className={
                  detailData.colorGet
                    ? "colorpicker  center hide"
                    : "colorpicker  center"
                }
              >
                <div>
                  <h3> Labels</h3>
                  <span
                    onClick={() => {
                      setDetailData((state) => ({
                        ...state,
                        colorPicker: false,
                        colorEdit: false,
                      }));
                    }}
                    style={{
                      display: "flex",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    <AiOutlineClose />
                  </span>
                </div>

                <div className="con">
                  {detailData.label.map((c, i) => {
                    let checked = labelArr.some((a) => a.idx === c.idx); // c.idx가 배열에 존재하는지 확인
                    return (
                      <div className="labelsCon" key={i}>
                        <input
                          ref={inputRef}
                          type="checkbox"
                          id={`check-${c.idx}`}
                          className="test"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const addArr = [...labelArr, c];
                              addlabel("addlabel", addArr);
                              //라벨
                            } else {
                              const copy = [...labelArr];
                              const result = copy.filter(
                                (a) => a.idx !== c.idx
                              );
                              addlabel("addlabel", result);
                            }
                          }}
                        ></input>
                        <label
                          htmlFor={`check-${c.idx}`}
                          style={{ background: c.color, color: c.textColor }}
                        >
                          {c.text}
                        </label>
                        <span
                          style={{
                            width: "25px",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                          onClick={() => {
                            setColorData((state) => ({
                              ...state,
                              text: detailData.label[i].text,
                              color: detailData.label[i].color,
                              textColor: detailData.label[i].textColor,
                              idx: detailData.label[i].idx,
                              index: i,
                            }));
                            setDetailData((state) => ({
                              ...state,
                              colorEdit: true,
                              colorGet: true,
                              colorId: c.idx,
                            }));
                            console.log(detailData.label[i]);

                            //dd
                          }}
                        >
                          {!checked && <AiOutlineEdit />}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="conBtn">
                  <button
                    onClick={() => {
                      setDetailData((state) => ({
                        ...state,
                        colorEdit: true,
                        colorGet: false,
                      }));

                      setColorData((state) => ({
                        ...state,
                        idx: "0",
                        color: "#164b35",
                        text: "",
                        textColor: "",
                      }));
                    }}
                  >
                    Create a new label
                  </button>
                </div>
              </div>
              <div
                className={
                  detailData.colorEdit
                    ? "colorpicker edit "
                    : "colorpicker edit index"
                }
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{ display: "flex", cursor: "pointer" }}
                    onClick={() => {
                      setDetailData((state) => ({
                        ...state,
                        colorEdit: false,
                        colorGet: false,
                      }));
                    }}
                  >
                    <MdArrowBackIosNew />
                  </span>
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    Edit label
                  </h3>
                  <span
                    onClick={() => {
                      setDetailData((state) => ({
                        ...state,
                        colorPicker: false,
                        colorEdit: false,
                        colorGet: false,
                      }));
                    }}
                    style={{
                      display: "flex",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    <AiOutlineClose />
                  </span>
                </div>
                <div className="colorDetail">
                  <div
                    style={{
                      background: colorData.color,
                      color: colorData.textColor,
                    }}
                  >
                    {colorData.text}
                  </div>
                </div>
                <p>Title</p>
                <div className="inputCon">
                  <input
                    type="text"
                    value={colorData.text || ""}
                    onChange={(e) => {
                      setColorData((state) => ({
                        ...state,
                        text: e.target.value,
                      }));
                    }}
                  />
                </div>
                <p>Select a color</p>
                <div className="colorCon">
                  {colorArr.map((a, i) => {
                    return (
                      <div
                        key={i}
                        data-id={a.id}
                        className={a.id == colorData.idx ? "colorActive" : ""}
                        style={{
                          background: a.color,
                          border: `2px ${a.color} solid`,
                        }}
                        onClick={(e) => {
                          setColorData((state) => ({
                            ...state,
                            idx: e.target.dataset.id,
                            color: a.color,
                            textColor: a.textColor,
                          }));
                        }}
                      ></div>
                    );
                  })}
                  {detailData.colorGet ? (
                    <>
                      <button
                        className="colorButton"
                        onClick={() => {
                          saveData("upDatecolor");
                          setDetailData((state) => ({
                            ...state,
                            colorEdit: false,
                            colorGet: false,
                          }));
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="colorButton"
                        onClick={() => {
                          saveData("delete");
                          setDetailData((state) => ({
                            ...state,
                            colorEdit: false,
                            colorGet: false,
                          }));
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="colorButton"
                      onClick={() => {
                        saveData("color");
                        setDetailData((state) => ({
                          ...state,
                          colorEdit: false,
                        }));
                        setColorData((state) => ({
                          ...state,
                          text: "",
                        }));
                      }}
                    >
                      Create
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mid">
          <span></span>
          <h3 className="title">Description</h3>
          <div>
            <input
              type="text"
              value={detailData.description || ""}
              onChange={(e) => {
                setDetailData((state) => ({
                  ...state,
                  description: e.target.value,
                }));
              }}
            />
            <button
              className={detailData.description !== "" && "active"}
              onClick={() => {
                saveData("description");
              }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="bottom">
          {/* <span></span>
          <h3 className="title">Activity</h3>
          <div>
            <input type="text" />
            <button>Save</button>
          </div> */}
          <div style={{ textAlign: "right" }}>
            <button
              className="delete"
              onClick={() => {
                deleteData("sub");
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
