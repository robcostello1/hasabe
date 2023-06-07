import "./AddTask.css";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Controller,
  FormContainer,
  SelectElement,
  TextFieldElement,
  useFormContext,
} from "react-hook-form-mui";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
// @ts-ignore
import MDEditor from "@uiw/react-md-editor";

import { POINT_SCALE } from "../utils/consts";
import { EditableTask, UpdateMode } from "../utils/types";

type FormValues = Pick<EditableTask, "name" | "body"> & {
  worryPoints: "" | number;
  effortPoints: "" | number;
};

const defaultValue: FormValues = {
  name: "",
  body: "",
  worryPoints: "",
  effortPoints: "",
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
  onChange?: Dispatch<SetStateAction<FormValues>>;
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
          render={({ field: { onChange, value } }) => (
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
        options={[...POINT_SCALE, { value: "", label: "" }]}
        fullWidth
      />

      <SelectElement
        name="worryPoints"
        label="Worry"
        options={[...POINT_SCALE, { value: "", label: "" }]}
        fullWidth
      />
    </>
  );
};

const valuesValidate = (values: FormValues): values is EditableTask =>
  typeof values.worryPoints === "number" &&
  typeof values.effortPoints === "number";

export default function AddTask({
  mode,
  currentTask,
  onClose,
  onSubmit,
  onSplit,
}: Props) {
  const [splitOrig, setSplitOrig] = useState<FormValues>(currentTask!);
  const [splitNew, setSplitNew] = useState<FormValues>({
    ...defaultValue,
    worryPoints: currentTask?.worryPoints || defaultValue.worryPoints,
  });

  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (valuesValidate(values)) {
        onSubmit(values);
        return;
      }
      // TODO show form warnings
      console.warn("Could not submit task: missing points");
    },
    [onSubmit]
  );

  const handleSplit = useCallback(
    (origTask: FormValues, newTask: FormValues) => {
      if (valuesValidate(origTask) && valuesValidate(newTask)) {
        onSplit(origTask, newTask);
        return;
      }
      // TODO show form warnings
      console.warn("Could not submit task: missing points");
    },
    [onSplit]
  );

  return mode === "single" ? (
    <FormContainer
      defaultValues={currentTask || defaultValue}
      onSuccess={handleSubmit}
    >
      <DialogTitle>{currentTask ? "Edit" : "Add"} task</DialogTitle>

      <DialogContent className="AddTask__form">
        <AddTaskForm />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
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
          onClick={() => handleSplit(splitOrig, splitNew)}
        >
          Split
        </Button>
      </DialogActions>
    </>
  );
}
