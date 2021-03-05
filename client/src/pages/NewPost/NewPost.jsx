import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { IconButton, Button } from '@material-ui/core';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useHistory, useParams } from 'react-router-dom';
import * as api from '../../api/index';

import './styles.sass';
import { createPostApi, modifyPostApi } from '../../api/index'
import camera from './image/camera.png';
import { convertImageToBase64 } from '../commons/custom/convertImageToBase64';
import { useWindowHeightAndWidth } from '../commons/custom/useWindowHeightAndWidth';
import LoadIcon from '../commons/components/LoadIcon/LoadIcon';


let initPost = {
    thumbnail: '',
    title: '',
    description: '',
    ration: '',
    time: '',
    ingredients: [{
        id: new Date().getTime().toString(),
        text: "",
    }],
    steps: [{
        id: new Date().getTime().toString(),
        text: '',
        images: [],
    }],
}

function NewPost(props) {
    const [height, width] = useWindowHeightAndWidth();
    const history = useHistory()

    const { slug } = useParams()
    const formik = useFormik({
        initialValues: initPost,
        validationSchema: Yup.object({
            title: Yup.string().required('Tiêu đề món ăn không thể để trống được!!!'),
            ingredients: Yup.array().required('Nguyên liệu không thể thiếu được.'),
            steps: Yup.array().required('Bạn vui lòng nhập các bước tạo thành món ăn.'),
        }),
        onSubmit: slug ?
            async (values) => {
                values.ingredients = values.ingredients.filter(ingredient => ingredient.text)
                values.steps = values.steps.filter(step => (step.text || step.images.length !== 0))


                const { data } = await modifyPostApi(slug, values);
                history.push(`/post/${data.slug}`)
            } :
            async (values) => {
                values.author = { uuid: JSON.parse(localStorage.getItem('profile')).result.uuid };
                values.ingredients = values.ingredients.filter(ingredient => ingredient.text)
                values.steps = values.steps.filter(step => (step.text || step.images.length !== 0))


                const { data } = await createPostApi(values)
                history.push(`/user/${data.author}`)
            }
    })

    
    useEffect(async () => {
        if(slug){
            const { data } = await api.getPostApi(slug);
            formik.setValues({ ...data })
        }
    }, [])

    //handle action ingredients
    const handleAddIngre = () => {
        let newIngredients = [
            ...formik.values.ingredients,
            {
                id: new Date().getTime().toString(),
                text: "",
            }
        ]
        formik.setValues({
            ...formik.values,
            ingredients: newIngredients,
        })


    }
    const handleChangeIngredient = (id, e) => {
        const newIngredients = formik.values.ingredients.map((ingredient) => {
            if (ingredient.id === id) {
                let newIngredient = {
                    ...ingredient,
                    text: e.target.value
                }
                return newIngredient;
            }
            return ingredient;
        })
        formik.setValues({
            ...formik.values,
            ingredients: newIngredients
        })
    }
    const handleDeleteIngre = (id) => {
        if (formik.values.ingredients.length == 1) return

        const newIngredients = formik.values.ingredients.filter(ingredient => id !== ingredient.id)
        formik.setValues({
            ...formik.values,
            ingredients: newIngredients
        })
    }

    //handle action steps
    const handleAddStep = () => {
        let newSteps = [
            ...formik.values.steps,
            {
                id: new Date().getTime().toString(),
                text: '',
                images: [],
            }
        ]
        formik.setValues({
            ...formik.values,
            steps: newSteps,
        })
    }
    const handleChangeStep = (id, e) => {
        const newSteps = formik.values.steps.map((step) => {
            if (step.id === id) {
                let newStep = {
                    ...step,
                    text: e.target.value
                }
                return newStep;
            }
            return step;
        })
        formik.setValues({
            ...formik.values,
            steps: newSteps
        })
    }
    const handleDeleteStep = (id) => {
        if (formik.values.steps.length == 1) return

        const newSteps = formik.values.steps.filter(step => id !== step.id)
        formik.setValues({
            ...formik.values,
            steps: newSteps
        })
    }

    //handle action step images
    const handleAddStepImage = (id, url) => {
        const newSteps = formik.values.steps.map((step) => {
            if (step.id === id) {
                let newImages = [
                    ...step.images,
                    {
                        id: new Date().getTime().toString(),
                        imageUrl: url
                    }
                ]
                let newStep = {
                    ...step,
                    images: newImages
                }
                return newStep;
            }
            return step;
        })
        formik.setValues({
            ...formik.values,
            steps: newSteps
        })
    }
    const handleDeleteStepImage = (stepId, imageId) => {
        const newSteps = formik.values.steps.map((step) => {
            if (step.id === stepId) {
                let newImages = step.images.filter(image => image.id !== imageId)
                let newStep = {
                    ...step,
                    images: newImages
                }
                return newStep;
            }
            return step;
        })
        formik.setValues({
            ...formik.values,
            steps: newSteps
        })
    }

    if (slug && !formik.values.title) {
        return (<LoadIcon />)
    }

    return (
        <form onSubmit={formik.handleSubmit} className="new-post-page">
            <div className="new-post-page--paper shadow">
                <label htmlFor="thumbnail" className="new-post-page--paper--thumbnail pointer">
                    {formik.values.thumbnail ?
                        <img src={formik.values.thumbnail} width='700' height='480' alt="" className="new-post-page--paper--thumbnail__img pointer" /> :
                        <div>
                            <img src={camera} alt="" className="new-post-page--paper--thumbnail__default pointer" />
                            <p>Hãy cho mọi người cùng thấy món ăn của bạn nào!!!</p>
                            <p>(Chèn 1 ảnh lớn ở đây)</p>
                        </div>}

                    <input
                        type="file"
                        name="thumbnail"
                        id="thumbnail"
                        onChange={(e) => {
                            convertImageToBase64(e.target.files[0], result => {
                                result && formik.setValues({ ...formik.values, thumbnail: result })
                            });
                        }}
                    />
                </label>
                <div className="new-post-page--paper--intro pd-left-3">
                    <input
                        type="text"
                        name='title'
                        maxLength='100'
                        autoComplete='off'
                        className="w-94 input-create-post-form input-create-post-form--title"
                        placeholder="Hãy nhập tên món ăn của bạn"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="signin-form--control__error">{formik.errors.title}</div>
                    ) : null}
                    <textarea
                        type="text"
                        name='description'
                        rows='3'
                        resize='none'
                        autoComplete='off'
                        className="w-94 input-create-post-form"
                        placeholder="Hãy chia sẻ đôi chút về món ăn này được không? Bạn lấy cảm hứng từ đâu? Trải nghiệm về món ăn này như thế nào? Món ăn phù hợp trong những dịp nào?"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                </div>
                <div className="new-post-page--paper--option pd-left-3 pd-right-3">
                    <p>Khẩu phần</p>
                    <input
                        type="number"
                        className="input-create-post-form w-50"
                        name='ration'
                        min={0}
                        max={100}
                        maxLength='5'
                        autoComplete='off'
                        placeholder="Số người ăn"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ration}
                    />
                </div>
                <div className="new-post-page--paper--option pd-left-3 pd-right-3 end-block">
                    <p>Thời gian nấu</p>
                    <input
                        type="number"
                        className="input-create-post-form w-50"
                        name='time'
                        min={0}
                        max={1000}
                        autoComplete='off'
                        placeholder="Số phút"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.time}
                    />
                </div>
                <div className="new-post-page--paper--ingredients pd-left-3 pd-right-3 end-block">
                    <h2 className="title-page">
                        Nguyên liệu
                    </h2>
                    {formik.values.ingredients.map((ingredient, index) => (
                        <div key={index} >
                            <div className="new-post-page--paper--ingredients--input">
                                <input
                                    type="text"
                                    className="input-create-post-form w-90"
                                    name='ingredients'
                                    maxLength='100'
                                    autoComplete='off'
                                    placeholder="500g thịt"
                                    onChange={(e) => handleChangeIngredient(ingredient.id, e)}
                                    onBlur={formik.handleBlur}
                                    value={ingredient.text}
                                />
                                <div>
                                    <IconButton onClick={() => handleDeleteIngre(ingredient.id)} size='small' ><CloseIcon fontSize='default' color='disabled' /></IconButton>
                                </div>
                            </div>
                            {formik.touched.ingredients && formik.errors.ingredients ? (
                                <div className="signin-form--control__error">{formik.errors.ingredients}</div>
                            ) : null}
                        </div>
                    ))}
                    <div onClick={handleAddIngre} className="new-post-page--paper--ingredients--add">
                        <Button >
                            <AddIcon /> Nguyên liệu
                        </Button>
                    </div>
                </div>
                <div className="new-post-page--paper--steps pd-left-3 pd-right-3 end-block">
                    <h2 className="title-page">
                        Các bước
                    </h2>

                    {formik.values.steps.map((step, index) => (
                        <div key={index}>
                            <div className="new-post-page--paper--steps--input">
                                <div className="new-post-page--paper--steps--input__number">
                                    <span>{index + 1}</span>
                                </div>
                                <textarea
                                    type="text"
                                    rows='2'
                                    className="input-create-post-form w-84"
                                    name='steps'
                                    maxLength='500'
                                    autoComplete='off'
                                    placeholder="Sơ chế, ướp gia vị..."
                                    onChange={(e) => handleChangeStep(step.id, e)}
                                    onBlur={formik.handleBlur}
                                    value={step.text}
                                />
                                <div>
                                    <IconButton onClick={() => handleDeleteStep(step.id)} size='small' ><CloseIcon fontSize='default' color='disabled' /></IconButton>
                                </div>
                            </div>

                            <div className="new-post-page--paper--steps--images">
                                {step.images.map((image, index) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                        <div className="new-post-page--paper--steps--images__image">
                                            <img width='160' height="128" src={image.imageUrl} key={index} alt="" />
                                        </div>
                                        <span className='new-post-page--paper--steps--images__icon'><HighlightOffIcon onClick={() => handleDeleteStepImage(step.id, image.id)} className='pointer' color='disabled' /></span>
                                    </div>
                                ))}
                                <label
                                    htmlFor={`step${step.id}`}
                                    className="new-post-page--paper--steps--images__image pointer"
                                >
                                    <div>
                                        <CameraAltIcon fontSize='large' />
                                    </div>
                                    <input
                                        type="file"
                                        name="step"
                                        id={`step${step.id}`}
                                        onChange={(e) => {
                                            convertImageToBase64(e.target.files[0], result => {
                                                result && handleAddStepImage(step.id, result)
                                            });
                                        }}
                                    />
                                </label>
                            </div>


                        </div>
                    ))}
                    <div onClick={handleAddStep} className="new-post-page--paper--steps--add">
                        <Button >
                            <AddIcon /> Bước
                        </Button>
                    </div>
                </div>

                <button type="submit" className={`button-submit ${width <= 1024 ? 'full-width' : ''}`}>Hoàn thành</button>

            </div>
        </form>
    );
}

export default NewPost;

// const gotPost = {
//     title: 'Chè Bột Lọc Hoa Đậu Biếc',
//     author: {
//         name: 'Nguyen Anh Tu',
//         imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
//         uuid: '12345677'
//     },
//     thumbnail: 'https://img-global.cpcdn.com/recipes/789b4d37cadb3160/640x640sq70/photo.webp',
//     ration: 3,
//     time: 60,
//     description: 'Bài đã được đăng 2Sao.vn',
//     ingredients: [
//         { id: '1287078har3', text: '150 g bột năng' },
//         { id: '12gadfadfg3', text: '80 ml nước sôi' },
//         { id: '12sdS3', text: '20 hoa đậu biếc' },
//         { id: '123ASDj', text: 'Đường phèn' },
//         { id: '12qwr3', text: '1 muỗng cafe gừng' },
//     ],
//     steps: [
//         {
//             id: 'fasdfas',
//             text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
//             images: [
//                 {
//                     id: '123',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//                 {
//                     id: '1234',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/a86ed9f63e540cdf/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//                 {
//                     id: '1235',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/3da9e488370a2ab7/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },


//             ]
//         }, {
//             id: '36ypu0y',
//             text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
//             images: [
//                 {
//                     id: '132',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//                 {
//                     id: '57356',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/a86ed9f63e540cdf/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//                 {
//                     id: '1341234',
//                     imageUrl: 'https://i.pinimg.com/564x/19/a8/50/19a850f56d42d24a7ebd81895b3a9487.jpg',
//                 },
//                 {
//                     id: '234234223',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/3da9e488370a2ab7/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//                 {
//                     id: '1635723',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//                 {
//                     id: '1223452343',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/3da9e488370a2ab7/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//             ]
//         }, {
//             id: '908uiyrhtaerd',
//             text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
//             images: [
//                 {
//                     id: '123',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//             ]
//         }, {
//             id: 'fasafdgfhdjghsdfas',
//             text: 'Cho bột vào thố, tạo thành một lỗ chính giữa, cho nước hoa đậu hiếc đang sôi cho vào, dùng vá gỗ trộn đều, rồi nhồi bột cho đến khi dẻo mịn.',
//             images: [
//                 {
//                     id: '123',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/647c3a7e13330012/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },
//                 {
//                     id: '123',
//                     imageUrl: 'https://img-global.cpcdn.com/steps/a86ed9f63e540cdf/160x128cq70/che-b%E1%BB%99t-l%E1%BB%8Dc-hoa-d%E1%BA%ADu-bi%E1%BA%BFc-recipe-step-1-photo.webp',
//                 },

//             ]
//         }
//     ],
//     likes: [1, 2, 3, 4],
//     comments: [{
//         author: {
//             name: 'Nguyen Anh Tu',
//             imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
//             uuid: '12345677'
//         },
//         createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
//         text: "ha ha day la 1 cai comment",
//     }, {
//         author: {
//             name: 'Nguyen Anh Tu',
//             imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
//             uuid: '12345677'
//         },
//         text: "ha ha day la 1 cai comment",
//         createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
//     }, {
//         author: {
//             name: 'Nguyen Anh Tu',
//             imageUrl: 'https://i.pinimg.com/564x/2c/93/5b/2c935b1c8bb1b8f2d730ead7602ebf3a.jpg',
//             uuid: '12345677'
//         },
//         text: "ha ha day la 1 cai comment",
//         createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
//     }],
//     slug: 'che-bot-loc-hoa-dau-biec',
//     createdAt: new Date("2021-02-26T16:57:55.195+00:00"),
// }