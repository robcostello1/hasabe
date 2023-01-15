import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Controller,
  FormContainer,
  SelectElement,
  TextFieldElement,
  useFormContext,
} from "react-hook-form-mui";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditableTask, UpdateMode } from "./utils/types";

// @ts-ignore
import MDEditor from "@uiw/react-md-editor";
import { POINT_SCALE } from "./utils/consts";

import "./AddTask.css";

const defaultValue: EditableTask = {
  name: "",
  body: "",
  effortPoints: 0,
  worryPoints: 0,
};

type Props = {
  mode: UpdateMode;
  currentTask?: EditableTask;
  onClose: () => void;
  onSubmit: (task: EditableTask) => void;
  onSplit: (origTask: EditableTask, newTask: EditableTask) => void;
};

const AddTaskForm = ({
  onChange,
}: {
  onChange?: Dispatch<SetStateAction<EditableTask>>;
}) => {
  const { getValues, formState } = useFormContext<EditableTask>();

  useEffect(() => {
    if (onChange) {
      onChange(getValues());
    }
  }, [formState, getValues, onChange]);

  return (
    <>
      <TextFieldElement name="name" label="Name" required fullWidth />

      <div style={{ marginBottom: 32 }}>
        <Controller
          name="body"
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <MDEditor
              hideToolbar
              preview="edit"
              value={value}
              onChange={onChange}
              className={"AddTask__body"}
              textareaProps={{
                placeholder: "Description…",
              }}
            />
          )}
        />
      </div>

      <SelectElement
        name="effortPoints"
        label="Effort"
        options={POINT_SCALE}
        fullWidth
      />

      <SelectElement
        name="worryPoints"
        label="Worry"
        options={POINT_SCALE}
        fullWidth
      />
    </>
  );
};

export default function AddTask({
  mode,
  currentTask,
  onClose,
  onSubmit,
  onSplit,
}: Props) {
  const [splitOrig, setSplitOrig] = useState(currentTask || defaultValue);
  const [splitNew, setSplitNew] = useState({
    ...defaultValue,
    worryPoints: currentTask?.worryPoints || defaultValue.worryPoints,
  });

  return mode === "single" ? (
    <FormContainer
      defaultValues={currentTask || defaultValue}
      onSuccess={onSubmit}
    >
      <DialogTitle>{currentTask ? "Add" : "Edit"} task</DialogTitle>

      <DialogContent className="AddTask__form">
        <AddTaskForm />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button variant="contained" type="submit">
          Save
        </Button>
      </DialogActions>
    </FormContainer>
  ) : (
    <>
      <DialogTitle>Split task</DialogTitle>

      <DialogContent className="AddTask__split">
        <div className="AddTask__form">
          <FormContainer defaultValues={currentTask}>
            <AddTaskForm onChange={setSplitOrig} />
          </FormContainer>
        </div>

        <div className="AddTask__form">
          <FormContainer defaultValues={defaultValue}>
            <AddTaskForm onChange={setSplitNew} />
          </FormContainer>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSplit(splitOrig, splitNew)}
        >
          Split
        </Button>
      </DialogActions>
    </>
  );
}
