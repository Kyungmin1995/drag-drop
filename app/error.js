"use client";
export default function Error({ error, reset }) {
  console.log(error);
  return (
    <>
      <div>에러</div>
      <div onClick={() => reset()}>리셋</div>
    </>
  );
}
