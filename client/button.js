"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DetailLink({ id }) {
  const router = useRouter();
  return <button onClick={() => router.push(`/detail/${id}`)}>버튼</button>;
}

export function EditButton({ id }) {
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({
    title: "",
    content: "",
  });
  const onClick = () => setEdit(!edit);

  const onChange = (e) =>
    setData((state) => ({ ...state, title: e.target.value }));

  const onSubmit = async (e) => {
    await axios
      .post("/api/edit", { id, title: data.title })
      .then((res) => console.log(res))
      .catch((err) => console.log(err.response));
  };
  useEffect(() => {
    setData("");
  }, []);

  return (
    <>
      <button onClick={onClick}>수정</button>
      {edit && (
        <>
          <input value={data.title} onChange={onChange} />
          <button onClick={onSubmit}>완료</button>
        </>
      )}
    </>
  );
}

export function DeleteButton({ id }) {
  const deleteHandler = async () => {
    console.log("삭제");
    try {
      const res = await axios.post("/api/delete", { id });
      console.log(res, "결과 ");
    } catch (err) {
      console.log(err.response, "에러");
    }
  };

  return <button onClick={deleteHandler}>버튼</button>;
}
