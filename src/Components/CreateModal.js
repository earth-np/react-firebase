import { css } from "@emotion/css";
import { DatePicker, Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
export const CreateModal = (props) => {
  const { visible, onCreate, onClose } = props;
  const [category, setCategory] = useState("Shopping");
  const [date, setDate] = useState();
  const [amount, setAmount] = useState();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    setCategory("Shopping");
    setDate();
    setAmount();
  }, []);

  return (
    <Modal
      title="Create Transaction"
      visible={visible}
      onOk={() => {
        const incomeCategory = ["Salary"];
        const type = incomeCategory.includes(category) ? "income" : "expense";
        const newTx = {
          type,
          category,
          date,
          imageUrl,
          amount: type === "expense" ? amount * -1 : amount,
        };
        onCreate(newTx);
      }}
      onCancel={() => {
        onClose();
      }}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          height: 150px;
          justify-content: space-between;
        `}
      >
        <Select
          placeholder="Select your category"
          value={category}
          onChange={(e) => {
            setCategory(e);
          }}
        >
          <Select.Option value="Shopping">Shopping</Select.Option>
          <Select.Option value="Salary">Salary</Select.Option>
        </Select>
        <DatePicker
          onChange={(e) => {
            setDate(e.format("DD MMM YYYY"));
          }}
        />
        <Input
          value={amount}
          placeholder="Input Amount"
          type="number"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <input
          type="file"
          onChange={(e) => {
            console.log(e.target.files);
            const file = e.target.files[0];
            const storageRef = ref(storage, `images/${file.name}`);
            const hide = message.loading("uploading image");
            uploadBytes(storageRef, file).then((result) => {
              console.log(result);
              getDownloadURL(result.ref).then((url) => {
                hide();
                message.success("image upload success");
                setImageUrl(url);
              });
            });
          }}
        />
      </div>
    </Modal>
  );
};
