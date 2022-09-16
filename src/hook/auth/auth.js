import { AuthService } from "src/hook/auth/AuthService";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { firestore as db } from "firebase/firebase";

const authContext = createContext();

export default function useAuth() {
  return useContext(authContext)
}

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [userrole, setUserrole] = useState();
	const [error, setError] = useState("");
	const [token, setToken] = useState("")
  const router = useRouter()
	const pathname = router.pathname;


	const loginWithGoogle = async () => {
		const { error, userData } = await AuthService.loginWithGoogle();
		setUser(userData ?? null)
		setError(error ?? "")
  }

	const loginWithFacebook = async () => {
    const { error, user } = await AuthService.loginWithFacebook();
		setUser(user ?? null)
		setError(error ?? "")
		// if (user !== null) {
		// 	db.collection("users").doc(user.uid).update({token: token})
		// }
  }
	const loginWithApple = async () => {
    const { error, user } = await AuthService.loginWithApple();
		setUser(user ?? null)
		setError(error ?? "")
		// if (user !== null) {
		// 	db.collection("users").doc(user.uid).update({token: token})
		// }
  }

  const logout = async () => {
    await AuthService.logout();
		setUser(null);
		setUserrole(null)
  }
	const createUserWithEmailAndPassword = async (email, password) => {
		console.log(password)
		if (email && password) {
			const { error, user } = await AuthService.createUserWithEmailAndPassword(
				email,
				password
			);
			console.log(error)
			// router.push(`/verify?email=${email}`);
			if (error==="The email address is badly formatted.") {
				setError({ [pathname.replace("/","")]: "유효하지 않은 이메일 입니다." });
				return;
			}
			if (error === "Password should be at least 6 characters") {
				setError({ [pathname.replace("/","")]: "비밀번호는 최소 6자리 이상이여야합니다." });
				return;
			}
			if (error === "The email address is already in use by another account.") {
				setError({ [pathname.replace("/","")]: "이미 등록된 이메일 주소입니다." });
				return;
			}
			if (error) {
				setError({ [pathname.replace("/","")]: error });
				return;
			}
			await db.collection("email").doc(email).set({"verified": false})
			setUser(user ?? null);
		} else {
			setError({ [pathname.replace("/","")]: "Email and password can not be empty" });
		}
	};

	const signInUserWithEmailAndPassword = async (email, password) => {
		if (email && password) {
			const { error, user } = await AuthService.signInUserWithEmailAndPassword(
				email,
				password
			);
			if (error==="The email address is badly formatted.") {
				setError({ [pathname.replace("/","")]: "유효하지 않은 이메일 입니다." });
				return;
			} else if (error === "There is no user record corresponding to this identifier. The user may have been deleted.") {
				setError({ [pathname.replace("/","")]: "이메일이나 비밀번호가 틀렸습니다." });
				return;
			} else if (error === "The password is invalid or the user does not have a password.") {
				setError({ [pathname.replace("/","")]: "이메일이나 비밀번호가 틀렸습니다." });
				return;
			} else if (error) {
				console.log(error)
				return;
			}
			setUser(user ?? null);
			router.push("/");
		} else if(password) {
			setError({ [pathname.replace("/","")]: "이메일을 입력해주세요." });
		} else if(email) {
			setError({ [pathname.replace("/","")]: "비밀번호를 입력해주세요." });
		}
	};


	const resetPassword = async (email) => {
		if (email) {
			const error = await AuthService.resetPassword(email);
			if (error) {
				console.log(error)
				setError({ [pathname]: error });
				return error;
			} else {
				return "success"
			}
		} else {
			console.log(error)
			return error
			setError({ [pathname]: "Email can not be empty" });
		}
	};

	const deleteAccount = async () => {
		const error = await AuthService.deleteAccount();
		setError({ [pathname]: error });
	};

	const updatePassword = async(newPassword, confirmNewPassword) => {
		if (newPassword !== confirmNewPassword) {
			setError({ [pathname.replace("/setting/","")]: "재확인 비밀번호가 다릅니다." });
		} else{
			AuthService.updatePassword(newPassword).then(() => {
				setError({ [pathname.replace("/setting/","")]: "비밀번호가 변경되었습니다." });
			}).catch((error) => {
				setError({ [pathname.replace("/setting/","")]: error });
			})
		}
	};

	const value = {
		user,
		userrole,
		error,
		token,
		setToken,
		setError,
    loginWithGoogle,
		loginWithFacebook,
		loginWithApple,
		logout,
		setUser,
		setUserrole,
		createUserWithEmailAndPassword,
		signInUserWithEmailAndPassword,
		resetPassword,
		deleteAccount,
		updatePassword,
	};


  return <authContext.Provider value={value} {...props} />

}