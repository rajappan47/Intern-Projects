import { Form, Input, Select, Button } from "antd";

const TaskForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);

    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Task Title"
        name="title"
        rules={[
          {
            required: true,
            message: "Please enter task title",
          },
          {
            min: 3,
            message: "Minimum 3 characters",
          },
          { pattern: /^\S/, message: 'Task title cannot start with a blank space!' },
          { pattern: /^[a-zA-Z ]+$/, message: 'Numbers and special characters are not allowed!' }
        ]}
      >
        <Input placeholder="Enter task title" />
      </Form.Item>

      <Form.Item
        label="Priority"
        name="priority"
        initialValue="Medium"
      >
        <Select
          options={[
            {
              label: "Low",
              value: "Low",
            },
            {
              label: "Medium",
              value: "Medium",
            },
            {
              label: "High",
              value: "High",
            },
          ]}
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
      >
        Add Task
      </Button>
    </Form>
  );
};

export default TaskForm;