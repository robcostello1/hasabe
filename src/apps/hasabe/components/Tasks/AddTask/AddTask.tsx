import './AddTask.css';

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
    Controller, FormContainer, SelectElement, TextFieldElement, useFormContext
} from 'react-hook-form-mui';

import { Box, Button, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// TODO introduce large dependencies (e.g. refractor)
// @ts-ignore
import MDEditor from '@uiw/react-md-editor';

import { POINT_SCALE } from '../../../utils/consts';
import { useLog } from '../../../utils/hooks';
import { EditableTask, Tag, UpdateMode } from '../../../utils/types';
import { TagSelector } from '../../Forms';
import { useTagMethods } from '../../Tags/hooks';

type FormValues = Pick<EditableTask, "name" | "body" | "tags"> & {
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
  mode?: UpdateMode;
  currentTask?: EditableTask;
  availableTags?: Tag[];
  onClose: () => void;
  onSubmit: (task: EditableTask) => void;
  onSplit: (origTask: EditableTask, newTask: EditableTask) => void;
};

const AddTaskForm = ({
  availableTags,
  onChange,
}: {
  availableTags?: Tag[];
  onChange?: Dispatch<SetStateAction<FormValues>>;
}) => {
  const { watch } = useFormContext<EditableTask>();
  const values = JSON.stringify(watch());

  useLog(availableTags, "availableTags");

  useEffect(() => {
    if (onChange) {
      // TODO - this is a bit hacky, but it is currently required for the split form.
      // We will move to a different UI for splitting tasks in the future.
      onChange(JSON.parse(values));
    }
  }, [values, onChange]);

  return (
    <>
      <TextFieldElement name="name" label="Name" required fullWidth />

      <Box sx={{ mb: 4 }}>
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
      </Box>

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

      <TagSelector availableTags={availableTags || []} />
    </>
  );
};

const valuesValidate = (values: FormValues): values is EditableTask =>
  typeof values.worryPoints === "number" &&
  typeof values.effortPoints === "number";

export default function AddTask({
  mode = "single",
  currentTask,
  availableTags,
  onClose,
  onSubmit,
  onSplit,
}: Props) {
  const [splitOrig, setSplitOrig] = useState<FormValues>(currentTask!);
  const [splitNew, setSplitNew] = useState<FormValues>({
    ...defaultValue,
    worryPoints: currentTask?.worryPoints || defaultValue.worryPoints,
  });

  const { handleAddTag } = useTagMethods();
  const createTag = useCallback(
    async (nameOrId?: string) => {
      if (!nameOrId || availableTags?.find(({ id }) => id === nameOrId)) {
        return nameOrId;
      }
      return await handleAddTag(nameOrId);
    },
    [availableTags, handleAddTag]
  );

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (valuesValidate(values)) {
        const tagId = await createTag(values.tags);
        onSubmit({ ...values, tags: tagId });
        return;
      }
      // TODO show form warnings
      console.warn("Could not submit task: missing points");
    },
    [createTag, onSubmit]
  );

  const handleSplit = useCallback(
    async (origTask: FormValues, newTask: FormValues) => {
      if (valuesValidate(origTask) && valuesValidate(newTask)) {
        const origTagId = await createTag(origTask.tags);
        const newTagId = await createTag(newTask.tags);
        onSplit(
          { ...origTask, tags: origTagId },
          { ...newTask, tags: newTagId }
        );
        return;
      }
      // TODO show form warnings
      console.warn("Could not submit task: missing points");
    },
    [createTag, onSplit]
  );

  return mode === "single" ? (
    <FormContainer
      defaultValues={currentTask || defaultValue}
      onSuccess={handleSubmit}
    >
      <DialogTitle>{currentTask ? "Edit" : "Add"} task</DialogTitle>

      <DialogContent className="AddTask__form">
        <AddTaskForm availableTags={availableTags} />
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
            <AddTaskForm
              onChange={setSplitOrig}
              availableTags={availableTags}
            />
          </FormContainer>
        </div>

        <div className="AddTask__form">
          <FormContainer defaultValues={defaultValue}>
            <AddTaskForm onChange={setSplitNew} availableTags={availableTags} />
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
