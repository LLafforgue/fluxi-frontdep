import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {loginUser} from '../reducers/user'
import {useRouter} from 'next/router'



function LoginInput({
  EMAIL_REGEX,
  signEmail,
  setSignEmail,
  signPassword,
  setSignPassword,
  loginError,
  setIsLogin,
  isLogin,
  setLoginError,
  dispatch,
  router
}) {
  const userConnect = async () => {
    setLoginError("");
    if (!EMAIL_REGEX.test(signEmail)) {
      setLoginError("Adresse email invalide");
      return;
    }
    if (!signPassword || signPassword.length < 6) {
      setLoginError("Mot de passe invalide");
      return;
    }

    try {
      const response = await fetch("https://fluxi-backdep.vercel.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signEmail, password: signPassword }),
      })
      console.log('fecth ok')
      const data = response.json();

      if (data.result) {
        const userRedux = {
          id: data.data._id,
          company: data.data.company,
          email: data.data.email,
          firstname: data.data.firstname,
          lastname: data.data.lastname,
        };

        // Stocker le token dans le localStorage
        localStorage.setItem("token", data.data.token);
        console.log('ok1')
        // Mettre à jour l'état de l'utilisateur dans Redux
        dispatch(loginUser(userRedux));
        console.log('ok redux')

        // Rediriger vers le tableau de bord
        router.replace("/dashboard");
      } else {
        console.log('pas ok 1')
        setLoginError("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setLoginError("Erreur serveur");
    }
  };

  return (
    <>
      <p className="text-[35px] text-[#333333] font-bold p-[15]">
        Ravis de vous revoir
      </p>

      <div className="flex flex-col w-[70%]">
        <label className="text-[15px] text-[#333333] mt-[30] mb-[10]">
          Email
        </label>
        <input
          placeholder="ludovic@mattis.fr"
          type="email"
          className="text-[15px] text-[#333333] border-[1] border-gray-300 outline-[#18CB96] rounded-[10] p-[5px]"
          required
          onChange={(e) => setSignEmail(e.target.value)}
          value={signEmail}
        />

        <label className="text-[15px] text-[#333333] mt-[30] mb-[10]">
          Mot de passe
        </label>
        <input
          placeholder="******"
          type="password"
          className="text-[15px] text-[#333333] border-[1] border-gray-300 outline-[#18CB96] rounded-[10] p-[5px]"
          required
          onChange={(e) => setSignPassword(e.target.value)}
          value={signPassword}
        />

        <button
          className="text-[15px] text-[#FFF] cursor-pointer bg-[#18CB96] rounded-[10] p-[5px] mt-[30]"
          onClick={() => {
            userConnect();
          }}
        >
          Je me connecte
        </button>
        {loginError && <p className="text-red-500 mt-4">{loginError}</p>}

        <div className="flex flex-col w-[100%] justify-center items-center ">
          <div className="flex items-center gap-4 w-[70%] mt-[25px]">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-sm text-gray-500 whitespace-nowrap">OU</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[15px] text-[#333333] border-[1] flex flex-row justify-center items-center rounded-[10] p-[5px] mt-[20] w-[50%] cursor-pointer"
          >
            Je m'enregistre
          </button>
        </div>
      </div>
    </>
  );
}


function RegisterInput({
  EMAIL_REGEX,
  signEmail,
  setSignEmail,
  signPassword,
  setSignPassword,
  setIsLogin,
  isLogin,
  signFirstname,
  setSignFirstname,
  signLastname,
  setSignLastname,
  formErrors,
  setFormErrors,
  signCompany,
  setSignCompany,
  dispatch,
  router
}) {

  const userRegister = () => {
  
    const errors = {};
    if (!signFirstname.trim()) errors.firstname = "Le prénom est requis";
    if (!signLastname.trim()) errors.lastname = "Le nom est requis";
    if (!signCompany.trim()) errors.company = "Le nom de la société est requis";
    if (!EMAIL_REGEX.test(signEmail)) errors.email = "Adresse email invalide";
    if (!signPassword.trim() || signPassword.length < 6)
      errors.password = "Mot de passe trop court (min 6 caractères)";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    fetch("https://fluxi-backdep.vercel.app/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: signFirstname,
        lastname: signLastname,
        email: signEmail,
        password: signPassword,
        company: signCompany,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(loginUser(data.user));
          setSignFirstname("");
          setSignLastname("");
          setSignEmail("");
          setSignPassword("");
          setSignCompany("");
          setIsLogin(false);
          router.replace("/dashboard");
        } else {
          console.error("Erreur lors de l'enregistrement :", data.message);
          setFormErrors({
            email: "Une erreur est survenue, vérifie les champs.",
          });
        }
      });
  };

  return (
    <>
      <p className="text-[35px] text-[#333333] font-bold p-[15]">
        Bienvenue sur Fluxi
      </p>

      <div className="flex flex-col w-[70%]">
        <div className="flex flex-row justify-between">

          <div className="flex flex-col">
            <label className="text-[15px] text-[#333333] mt-[30] mb-[10]">
              Prénom
            </label>
            <input
              placeholder="Ludovic"
              className="text-[15px] text-[#333333] border-[1] border-gray-300 outline-[#18CB96] rounded-[10] p-[5px]"
              required
              onChange={(e) => setSignFirstname(e.target.value)}
              value={signFirstname}
            />
            {formErrors.firstname && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.firstname}
              </p>
            )}
          	</div>

          <div className="flex flex-col">
            <label className="text-[15px] text-[#333333] mt-[30] mb-[10]">
              Nom
            </label>
            <input
              placeholder="Bueno"
              className="text-[15px] text-[#333333] border-[1] border-gray-300 outline-[#18CB96] rounded-[10] p-[5px]"
              required
              onChange={(e) => setSignLastname(e.target.value)}
              value={signLastname}
            />
            {formErrors.lastname && (
              <p className="text-red-500 text-sm mt-1">{formErrors.lastname}</p>
            )}
          </div>
        </div>

        <label className="text-[15px] text-[#333333] mt-[30] mb-[10]">
          Email
        </label>
        <input
          placeholder="ludovic@mattis.fr"
          className="text-[15px] text-[#333333] border-[1] border-gray-300 outline-[#18CB96] rounded-[10] p-[5px]"
          required
          onChange={(e) => setSignEmail(e.target.value)}
          value={signEmail}
        ></input>
        {formErrors.email && (
          <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
        )}

        <label className="text-[15px] text-[#333333] mt-[30] mb-[10]">
          Société
        </label>
        <input
          placeholder="SARL MATTIS"
          className="text-[15px] text-[#333333] border-[1] border-gray-300 outline-[#18CB96] rounded-[10] p-[5px]"
          required
          onChange={(e) => setSignCompany(e.target.value)}
          value={signCompany}
        />
        {formErrors.company && (
          <p className="text-red-500 text-sm mt-1">{formErrors.company}</p>
        )}

        <label className="text-[15px] text-[#333333] mt-[30] mb-[10]">
          Mot de passe
        </label>
        <input
          placeholder="*******"
          type="password"
          className=" pl-2 text-[15px] text-[#333333] border-[1] border-gray-300 outline-[#18CB96] rounded-[10] p-[5px]"
          required
          onChange={(e) => setSignPassword(e.target.value)}
          value={signPassword}
        ></input>
        {formErrors.password && (
          <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
        )}

        <button
          className="cursor-pointer text-[15px] text-[#FFF] bg-[#18CB96] rounded-[10] p-[5px] mt-[30] "
          onClick={() => {
            userRegister();
          }}
        >
          Je m'enregistre
        </button>

        {/* Ou + connection Google */}
        <div className="flex flex-col w-[100%] justify-center items-center ">
          <div className="flex items-center gap-4 w-[70%] mt-[25px]">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-sm text-gray-500 whitespace-nowrap">OU</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[15px] text-[#333333] border-[1] flex flex-row justify-center items-center rounded-[10] p-[5px] mt-[20] w-[50%]"
          >
            Se connecter
          </button>
        </div>
      </div>
    </>
  );
}



function login() {

    const dispatch = useDispatch();
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true)
    const [signFirstname, setSignFirstname] = useState('')
    const [signLastname, setSignLastname] = useState('')
    const [signEmail, setSignEmail] = useState('')
    const [signPassword, setSignPassword] = useState('')
    const [signCompany, setSignCompany] = useState('')
	  const [formErrors, setFormErrors] = useState({});
	  const [loginError, setLoginError] = useState('');
    
	const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	useEffect(()=>{     
			
		async function checkAuth() {
			const token = localStorage.getItem("token");
			if (!token) return
			
			const res = await fetch("https://fluxi-backdep.vercel.app/api/check-token", {
			headers: { Authorization: `Bearer ${token}`},});

			// If token is invalid logout
			if (res.status == 401) {
				router.replace("/logout");
				return
			}}

		checkAuth();
	},[])
    
    return (
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Colonne de gauche */}
        <div className="lg:w-1/2 w-full bg-gray-100 flex items-center justify-center flex-col">
          <Image
            src="./image/logo.svg"
            height="300"
            width="400"
            alt="Logo"
            className="mb-20"
          />
          <h3 className="text-[35px] text-[#333333] text-center font-bold p-[15]">
            Sortez de l'opérationnel maintenant
          </h3>
          <p className="text-[22px] text-[#333333]  p-[15]">
            Votre business devient simple avec Fluxi
          </p>
        </div>

        {/* Colonne de droite */}
        <div className="lg:w-1/2 w-full bg-white flex items-center justify-center flex-col">
          {isLogin ? (
            <LoginInput
              EMAIL_REGEX={EMAIL_REGEX}
              signEmail={signEmail}
              setSignEmail={setSignEmail}
              signPassword={signPassword}
              setSignPassword={setSignPassword}
              loginError={loginError}
              setIsLogin={setIsLogin}
              isLogin={isLogin}
              setLoginError={setLoginError}
              dispatch={dispatch}
              router={router}
            />
          ) : (
            <RegisterInput
              EMAIL_REGEX={EMAIL_REGEX}
              signEmail={signEmail}
              setSignEmail={setSignEmail}
              signPassword={signPassword}
              setSignPassword={setSignPassword}
              setIsLogin={setIsLogin}
              isLogin={isLogin}
              signFirstname={signFirstname}
              setSignFirstname={setSignFirstname}
              signLastname={signLastname}
              setSignLastname={setSignLastname}
              formErrors={formErrors}
              signCompany={signCompany}
              setSignCompany={setSignCompany}
              setFormErrors={setFormErrors}
              dispatch={dispatch}
              router={router}
            />
          )}
        </div>
      </div>
    );
}

export default login