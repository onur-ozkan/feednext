import React, { useState, Dispatch, SetStateAction } from 'react'
import { FormComponentProps } from 'antd/lib/form/Form'
import { Form, Input, Tooltip, Icon, Select, Row, Col, Checkbox, Button } from 'antd'

const { Option } = Select

const SignUpComponent: React.FC<FormComponentProps> = props => {

    const [confirmDirty, setDirty]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false)

    const { getFieldDecorator } = props.form


    const handleSubmit = e => {
        e.preventDefault()
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
            }
        })
    }

    const handleConfirmBlur = e => {
        const { value } = e.target
        setDirty(confirmDirty || !!value)
    }

    const compareToFirstPassword = (rule, value, callback) => {
        const { form } = props
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!')
        } else {
            callback()
        }
    }

    const validateToNextPassword = (rule, value, callback) => {
        const { form } = props
        if (value && confirmDirty) {
            form.validateFields(['confirm'], { force: true })
        }
        callback()
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    }

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 8,
            },
        },
    }

    return (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
            <Form.Item
                label="Fullname"
            >
                {getFieldDecorator('fullname', {
                    rules: [{ required: true, message: 'Please input your name and surname!', whitespace: false }],
                })(<Input />)}
            </Form.Item>
            <Form.Item
                label={
                    <span>
                        Username{' '}
                        <Tooltip title="What do you want others to call you?">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                }
            >
                {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="E-mail">
                {getFieldDecorator('email', {
                    rules: [
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="Password" hasFeedback>
                {getFieldDecorator('password', {
                    rules: [
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            validator: validateToNextPassword,
                        },
                    ],
                })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="Confirm Password" hasFeedback>
                {getFieldDecorator('confirm', {
                    rules: [
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        {
                            validator: compareToFirstPassword,
                        },
                    ],
                })(<Input.Password onBlur={handleConfirmBlur} />)}
            </Form.Item>
            <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                <Row gutter={8}>
                    <Col span={12}>
                        {getFieldDecorator('captcha', {
                            rules: [{ required: true, message: 'Please input the captcha you got!' }],
                        })(<Input />)}
                    </Col>
                    <Col span={12}>
                        <Button>Get captcha</Button>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                {getFieldDecorator('agreement', {
                    valuePropName: 'checked',
                })(
                    <Checkbox>
                        I have read the <a href="">agreement</a>
                    </Checkbox>,
                )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Register
          </Button>
            </Form.Item>
        </Form>
    )
}

export default Form.create({ name: 'normal_login' })(SignUpComponent)