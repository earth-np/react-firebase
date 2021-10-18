import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { css } from "@emotion/css";
import { Modal, Button, Input, Select, DatePicker } from "antd";
import { TransactionRow } from "./Components/TransactionRow";
import { useEffect, useState } from "react";
import { CreateModal } from "./Components/CreateModal";
import styled from "@emotion/styled";
import { googleProvider, db } from "./firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const PageContainer = styled.div`
  background-color: aliceblue;
  height: 100vh;
  width: 100vw;
  padding-top: 100px;
`;

const PageContent = styled.div`
  width: 80%;
  margin: auto;
  max-width: 500px;
`;

const FlexBox = styled.div`
  display: flex;
`;

function App() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState();
  const [search, setSearch] = useState("");

  // const fetchTransactions = async () => {
  //   const querySnapshot = await getDocs(collection(db, "transactions"));
  //   let transactions = [];
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.id);
  //     const transaction = { id: doc.id, ...doc.data() };
  //     transactions.push(transaction);
  //   });
  //   setTransactions(transactions);
  // };

  const createTransaction = async (tx) => {
    const transaction = {
      ownerId: user.uid,
      ...tx,
    };
    console.log(transaction);
    const response = await addDoc(collection(db, "transactions"), transaction);
  };

  useEffect(() => {
    if (user) {
      const queryDB = query(
        collection(db, "transactions"),
        where("ownerId", "==", user.uid)
      );
      onSnapshot(queryDB, (querySnapshot) => {
        let transactions = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          const transaction = { id: doc.id, ...doc.data() };
          transactions.push(transaction);
        });
        setTransactions(transactions);
      });
    }
  }, [user]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    // fetchTransactions();
  }, []);

  const onDeleteItem = async (id) => {
    console.log(id);
    const deletedResponse = await deleteDoc(doc(db, "transactions", id));
    // setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const filteredTransaction = transactions.filter((tx) =>
    tx.category.includes(search)
  );

  return (
    <PageContainer>
      <div
        className={css`
          display: flex;
          width: 100%;
          background-color: white;
          position: fixed;
          top: 0;
          justify-content: flex-end;
          padding: 16px;
          z-index: 10;
        `}
      >
        {user ? (
          <div>
            {user.displayName}{" "}
            <Button
              onClick={async () => {
                const auth = getAuth();
                const response = await signOut(auth);
                console.log(response);
                setUser();
              }}
            >
              SignOut
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              setLoginModalVisible(true);
            }}
          >
            Login
          </Button>
        )}
      </div>
      <PageContent>
        <FlexBox>
          <Input
            placeholder="Search by text"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button onClick={() => setCreateModalVisible(true)}>Create</Button>
        </FlexBox>
        {transactions.length === 0 ? (
          <FlexBox
            className={css`
              padding-top: 3rem;
              justify-content: center;
            `}
          >
            <h1>No data</h1>
          </FlexBox>
        ) : (
          ""
        )}
        {filteredTransaction.map((tx) => (
          <TransactionRow tx={tx} onDeleteItem={onDeleteItem} />
        ))}
      </PageContent>
      <Modal
        title="Login"
        visible={loginModalVisible}
        onOk={() => {
          setLoginModalVisible(false);
        }}
        onCancel={() => {
          setLoginModalVisible(false);
        }}
      >
        <Button
          onClick={() => {
            const auth = getAuth();
            signInWithPopup(auth, googleProvider).then((data) => {
              console.log(data);
              setUser(data.user);
              setLoginModalVisible(false);
            });
          }}
        >
          Login by GMAIL
        </Button>
      </Modal>
      <CreateModal
        visible={createModalVisible}
        onCreate={async (tx) => {
          await createTransaction(tx);
          // setTransactions([...transactions, tx]);
          setCreateModalVisible(false);
        }}
        onClose={() => setCreateModalVisible(false)}
      />
    </PageContainer>
  );
}

export default App;
