import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTask from "./AddTask";

describe("AddTask", () => {
  it("handles adding a task", async () => {
    const handleSubmit = jest.fn();

    render(
      <AddTask
        mode="single"
        onSubmit={handleSubmit}
        onClose={() => {}}
        onSplit={() => {}}
      />
    );

    userEvent.type(screen.getByLabelText("Name *"), "Task name");

    userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      return expect(handleSubmit).toHaveBeenCalledWith(
        {
          name: "Task name",
          // TODO testing body and select interactions is more difficult due to 3rd party libraries
          body: "",
          effortPoints: 0,
          worryPoints: 0,
        },
        // Also returns the event
        expect.any(Object)
      );
    });
  });

  it("handles editing an existing task", async () => {
    const handleSubmit = jest.fn();

    render(
      <AddTask
        mode="single"
        currentTask={{
          type: "task",
          name: "Task name",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean feugiat urna eu metus imperdiet aliquet. Phasellus convallis sodales mi ac vehicula.",
          effortPoints: 3,
          worryPoints: 5,
        }}
        onSubmit={handleSubmit}
        onClose={() => {}}
        onSplit={() => {}}
      />
    );

    userEvent.type(screen.getByLabelText("Name *"), " that's been edited");

    userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      return expect(handleSubmit).toHaveBeenCalledWith(
        {
          name: "Task name that's been edited",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean feugiat urna eu metus imperdiet aliquet. Phasellus convallis sodales mi ac vehicula.",
          effortPoints: 3,
          worryPoints: 5,
        },
        expect.any(Object)
      );
    });
  });

  it.todo("handles splitting an existing task");
});
