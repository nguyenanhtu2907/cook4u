import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { convertImageToBase64 } from "../commons/custom/convertImageToBase64";
import { useWindowHeightAndWidth } from "../commons/custom/useWindowHeightAndWidth";
import { useDispatch } from "react-redux";

import * as api from "../../api/index";
import "./styles.sass";
function Setting(props) {
  const currentUser = JSON.parse(localStorage.getItem("profile"))?.result;
  const { setting, uuid } = useParams();
  const [height, width] = useWindowHeightAndWidth();
  const history = useHistory();
  const dispatch = useDispatch();
  if (uuid !== currentUser.uuid) {
    history.push("/");
  }
  const [currentTab, setCurrenttab] = useState(setting);

  const [messageFrDb, setMessageFrDb] = useState({
    success: false,
    message: "",
  });
  // useEffect(() => {

  // })
  const infoFormik = useFormik({
    initialValues: {
      imageUrl: currentUser.imageUrl,
      name: currentUser.name,
      description: currentUser.description,
      phone: currentUser.phone,
      gender: currentUser.gender,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Trường này là bắt buộc!!!"),
      phone: Yup.string().required("Trường này là bắt buộc!!!"),
      gender: Yup.string().required("Trường này là bắt buộc!!!"),
    }),
    onSubmit: async (values) => {
      const { data } = await api.updateUserApi({
        setting: "information",
        formValues: values,
      });

      setMessageFrDb(data.message);
      dispatch({
        type: "SIGNIN",
        payload: {
          result: { ...data.newUser },
          token: JSON.parse(localStorage.getItem("profile"))?.token,
        },
      });
    },
  });
  const passwordFormik = useFormik({
    initialValues: {
      old_password: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      old_password: Yup.string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự!!!")
        .required("Trường này là bắt buộc!!!"),
      password: Yup.string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự!!!")
        .required("Trường này là bắt buộc!!!"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu nhập lại chưa đúng!!!")
        .required("Trường này là bắt buộc!!!"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await api.updateUserApi({
          setting: "password",
          formValues: values,
        });
        setMessageFrDb(data.message);
      } catch (error) {
        setMessageFrDb("Failure, please try again!");
      }
    },
  });

  return (
    <div className="setting-page">
      <div className="setting-page--paper pd-left-3 pd-right-3 shadow">
        <ul className="setting-page--paper--options">
          <li
            onClick={() => {
              setCurrenttab("information");
              setMessageFrDb({
                success: false,
                message: "",
              });
            }}
            className={`${currentTab == "information" && "chosen shadow"} `}
          >
            <h2>Thông tin cá nhân</h2>
          </li>
          <li
            onClick={() => {
              setCurrenttab("password");
              setMessageFrDb({
                success: false,
                message: "",
              });
            }}
            className={`${currentTab == "password" && "chosen shadow"} `}
          >
            <h2>Mật khẩu</h2>
          </li>
        </ul>

        <div className="setting-page--paper--forms">
          <form
            onSubmit={
              currentTab === "information"
                ? infoFormik.handleSubmit
                : passwordFormik.handleSubmit
            }
          >
            {messageFrDb.message && (
              <span
                className={`signin-form--option ${
                  messageFrDb.success ? "success-message" : "failure-message"
                }`}
              >
                {messageFrDb.message}
              </span>
            )}
            {currentTab === "information" ? (
              <>
                <label
                  htmlFor="imageUrl"
                  className="setting-page--paper--forms__image pointer"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={infoFormik.values.imageUrl}
                    width="200"
                    height="200"
                    alt=""
                    className=""
                  />
                  <input
                    type="file"
                    name="imageUrl"
                    className="dp-none"
                    id="imageUrl"
                    onChange={(e) => {
                      convertImageToBase64(e.target.files[0], (result) => {
                        result &&
                          infoFormik.setValues({
                            ...infoFormik.values,
                            imageUrl: result,
                          });
                      });
                    }}
                  />
                </label>
                <div
                  className={`${
                    width < 768 && "flex-column"
                  } signin-form--control`}
                >
                  <label htmlFor="name">Tên đầy đủ: </label>
                  <input
                    className="signin-form--control__input"
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    onChange={(e) => {
                      infoFormik.handleChange(e);
                      setMessageFrDb({
                        success: false,
                        message: "",
                      });
                    }}
                    onBlur={infoFormik.handleBlur}
                    value={infoFormik.values.name}
                  />
                  {infoFormik.touched.name && infoFormik.errors.name ? (
                    <div className="signin-form--control__error">
                      {infoFormik.errors.name}
                    </div>
                  ) : null}
                </div>
                <div
                  className={`${
                    width < 768 && "flex-column"
                  } signin-form--control`}
                >
                  <label htmlFor="phone">Số điện thoại:</label>
                  <input
                    className="signin-form--control__input"
                    id="phone"
                    name="phone"
                    type="text"
                    autoComplete="off"
                    onChange={(e) => {
                      infoFormik.handleChange(e);
                      setMessageFrDb({
                        success: false,
                        message: "",
                      });
                    }}
                    onBlur={infoFormik.handleBlur}
                    value={infoFormik.values.phone}
                  />
                  {infoFormik.touched.phone && infoFormik.errors.phone ? (
                    <div className="signin-form--control__error">
                      {infoFormik.errors.phone}
                    </div>
                  ) : null}
                </div>

                <div
                  className={`${
                    width < 768 && "flex-column"
                  } signin-form--control`}
                >
                  <label htmlFor="gender">Giới tính:</label>
                  <div
                    role="group"
                    aria-labelledby="gender"
                    id="gender"
                    onChange={(e) => {
                      infoFormik.handleChange(e);
                      setMessageFrDb({
                        success: false,
                        message: "",
                      });
                    }}
                    onBlur={infoFormik.handleBlur}
                    value={infoFormik.values.gender}
                  >
                    <div>
                      <label className="radio-formik">
                        <input
                          type="radio"
                          name="gender"
                          value="Nam"
                          defaultChecked={
                            infoFormik.values.gender === "Nam" ? true : false
                          }
                        />{" "}
                        Nam
                      </label>
                      <label className="radio-formik">
                        <input
                          type="radio"
                          name="gender"
                          value="Nữ"
                          defaultChecked={
                            infoFormik.values.gender === "Nữ" ? true : false
                          }
                        />{" "}
                        Nữ
                      </label>
                      <label className="radio-formik">
                        <input
                          type="radio"
                          name="gender"
                          value="Khác"
                          defaultChecked={
                            infoFormik.values.gender === "Khác" ? true : false
                          }
                        />{" "}
                        Khác
                      </label>
                    </div>
                  </div>

                  {infoFormik.touched.gender && infoFormik.errors.gender ? (
                    <div className="signin-form--control__error">
                      {infoFormik.errors.gender}
                    </div>
                  ) : null}
                </div>
                <div
                  className={`${
                    width < 768 && "flex-column"
                  } signin-form--control`}
                >
                  <label htmlFor="description">Mô tả cá nhân:</label>
                  <textarea
                    className="signin-form--control__input"
                    id="description"
                    name="description"
                    type="text"
                    rows="4"
                    style={{ resize: "vertical" }}
                    autoComplete="off"
                    onChange={(e) => {
                      infoFormik.handleChange(e);
                      setMessageFrDb({
                        success: false,
                        message: "",
                      });
                    }}
                    onBlur={infoFormik.handleBlur}
                    value={infoFormik.values.description}
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className={`${
                    width < 768 && "flex-column"
                  } signin-form--control`}
                >
                  <label htmlFor="old_password">Mật khẩu cũ:</label>
                  <input
                    className="signin-form--control__input"
                    id="old_password"
                    name="old_password"
                    type="password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.old_password}
                  />
                  {passwordFormik.touched.old_password &&
                  passwordFormik.errors.old_password ? (
                    <div className="signin-form--control__error">
                      {passwordFormik.errors.old_password}
                    </div>
                  ) : null}
                </div>
                <div
                  className={`${
                    width < 768 && "flex-column"
                  } signin-form--control`}
                >
                  <label htmlFor="password">Mật khẩu:</label>
                  <input
                    className="signin-form--control__input"
                    id="password"
                    name="password"
                    type="password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.password}
                  />
                  {passwordFormik.touched.password &&
                  passwordFormik.errors.password ? (
                    <div className="signin-form--control__error">
                      {passwordFormik.errors.password}
                    </div>
                  ) : null}
                </div>
                <div
                  className={`${
                    width < 768 && "flex-column"
                  } signin-form--control`}
                >
                  <label htmlFor="confirm_password">Nhập lại mật khẩu:</label>
                  <input
                    className="signin-form--control__input"
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    value={passwordFormik.values.confirm_password}
                  />
                  {passwordFormik.touched.confirm_password &&
                  passwordFormik.errors.confirm_password ? (
                    <div className="signin-form--control__error">
                      {passwordFormik.errors.confirm_password}
                    </div>
                  ) : null}
                </div>
              </>
            )}
            <button
              type="submit"
              className={`button-submit ${width <= 1024 && "full-width"}`}
            >
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Setting;
