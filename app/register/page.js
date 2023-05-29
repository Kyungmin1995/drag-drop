export default function Register() {
  return (
    <div className="sign ">
      <div className="card">
        <form method="POST" action="/api/auth/signup">
          <div>
            <label htmlFor="name">name</label>
            <input id="name" name="name" type="text" placeholder="이름" />
          </div>
          <div>
            <label htmlFor="email">email</label>
            <input id="email" name="email" type="text" placeholder="이메일" />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input name="password" type="password" placeholder="비번" />
          </div>

          <button type="submit">id/pw 가입요청</button>
        </form>
      </div>
    </div>
  );
}
