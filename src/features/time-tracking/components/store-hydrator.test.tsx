import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { StoreHydrator } from "./store-hydrator";
import { saveState } from "../lib/storage";
import { useTimeTrackingStore } from "../store/time-tracking-store";
import { aProject } from "../testing/object-mothers";

describe("StoreHydrator", () => {
  beforeEach(() => {
    localStorage.clear();
    useTimeTrackingStore.setState({
      projects: [],
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });
  });

  it("should_render_nothing", () => {
    // Arrange & Act
    const { container } = render(<StoreHydrator />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("should_load_persisted_state_into_the_store_after_mounting", () => {
    // Arrange
    const project = aProject();
    saveState({
      projects: [project],
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });

    // Act
    render(<StoreHydrator />);

    // Assert
    expect(useTimeTrackingStore.getState().projects).toEqual([project]);
  });
});
