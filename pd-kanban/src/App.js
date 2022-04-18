import { Button, Slider, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Box, Flex } from "reflexbox";
import TodoItem from "./components/TodoItem";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterMoment";
import { LocalizationProvider } from "@mui/lab";
import { v4 as uuid } from "uuid";
import WeightedIntervalScheduling from "./utils/weightedIntervalScheduling";
import moment from "moment";
import Cronometer from "./components/Cronometer";
import Navbar from "./components/Navbar";
import "./App.css";
const tasksColumns = [
  {
    name: "Tasks",
    items: [],
  },
  {
    name: "To do",
    items: [],
  },
  {
    name: "In Progress",
    items: [],
  },
  {
    name: "Done",
    items: [],
  },
];

function App() {
  const [columns, setColumns] = useState(tasksColumns);
  const [value, setValue] = useState(new Date("2021-03-05T08:00:00"));
  const [time, setTime] = useState(0);
  const [interval, setIntervalState] = useState(null);
  const [points, setPoints] = useState(0);
  const handleChangeTime = (newValue) => {
    setValue(newValue);
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
    let newBoardData = columns;
    var dragItem =
      newBoardData[parseInt(source.droppableId)].items[source.index];
    newBoardData[parseInt(source.droppableId)].items.splice(source.index, 1);
    newBoardData[parseInt(destination.droppableId)].items.splice(
      destination.index,
      0,
      dragItem
    );
    setColumns(newBoardData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskId = e.target.attributes["id"].value;
    const description = e.target.elements.description.value;
    const startTime = e.target.elements.startTime.value;
    const duration = e.target.elements.duration.value;
    const weight = e.target.elements.weight.value;
    let endTime = moment(startTime, "h:mm A")
      .add(duration, "hours")
      .format("hh:mm A");
    const item = {
      id: uuid(),
      content: description,
      startTime,
      endTime,
      weight,
    };
    let newTasksData = columns;
    newTasksData[taskId].items.push(item);
    setColumns([...newTasksData]);
  };

  const startTimer = () => {
    let newTime = time;
    setIntervalState(setInterval(() => setTime((newTime += 1800)), 1000));
  };

  const resetTasks = () => {
    setTime(0);
    setPoints(0);
    clearInterval(interval);
    setColumns([
      {
        name: "Tasks",
        items: [],
      },
      {
        name: "To do",
        items: [],
      },
      {
        name: "In Progress",
        items: [],
      },
      {
        name: "Done",
        items: [],
      },
    ]);
  };
  useEffect(() => {
    let startItem = columns?.[1].items?.find((data) =>
      moment(
        moment().hour(0).minute(0).second(time).format("hh:mm A"),
        "hh:mm A"
      ).isBetween(
        moment(data?.startTime, "hh:mm A"),
        moment(data?.endTime, "hh:mm A"),
        null,
        "[)"
      )
    );

    let endItem = columns?.[2].items?.find((data) =>
      moment(
        moment().hour(0).minute(0).second(time).format("hh:mm A"),
        "hh:mm A"
      ).isSameOrAfter(
        moment(data?.endTime, "hh:mm A"),
        moment(data?.endTime, "hh:mm A"),
        null
      )
    );

    if (startItem?.startTime) {
      let newColumn1 = columns?.[1]?.items?.filter(
        (data) => data.startTime !== startItem.startTime
      );
      columns?.[2].items?.push(startItem);
      columns[1].items = newColumn1;
      setColumns([...columns]);
    }
    if (endItem?.endTime) {
      let newColumn2 = columns?.[2]?.items?.filter(
        (data) => data.endTime !== endItem.endTime
      );
      columns?.[3].items?.push(endItem);
      columns[2].items = newColumn2;
      setColumns([...columns]);
      console.log(points, endItem.weight);
      setPoints(points + parseInt(endItem.weight, 10));
    }
  }, [columns, time]);

  return (
    <>
      <Navbar />
      <Box marginTop="7.5rem">
        <Flex
          flexDirection="column"
          alignItems="center"
          style={{ gap: "2rem" }}
        >
          <Typography
            fontSize="20px"
            fontWeight="600"
            backgroundColor="#DCDCDC"
            padding="0.8rem"
            justifyContent="center"
            style={{
              borderRadius: "3px",
            }}
          >
            Total Points Done: {points}
          </Typography>

          <Flex width="100%" justifyContent="center">
            <Cronometer time={time} />
            <Button
              variant="contained"
              onClick={() => startTimer()}
              style={{ marginLeft: "0.5rem", background: "#32CD32" }}
            >
              Start Timer
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                resetTasks();
              }}
              style={{ marginLeft: "0.5rem", background: "#FF6347" }}
            >
              Reset Tasks
            </Button>
          </Flex>
        </Flex>

        <Flex justifyContent="center" height="100%">
          <DragDropContext onDragEnd={onDragEnd}>
            {columns.map((column, bIndex) => {
              return (
                <Flex flexDirection="column" alignItems="center">
                  <h2>{column.name}</h2>
                  <Box margin="10px">
                    <Droppable droppableId={bIndex.toString()}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              padding: 8,
                              width: 250,
                              borderRadius: "7px",
                              overflowY: "auto",
                              height: 500,
                            }}
                            className="container"
                          >
                            {column?.items?.length > 0 &&
                              column?.items?.map((item, index) => {
                                return <TodoItem data={item} index={index} />;
                              })}
                            {provided.placeholder}
                            {bIndex === 0 && (
                              <Box>
                                <form
                                  onSubmit={handleSubmit}
                                  id={bIndex}
                                  style={{ padding: "0.5rem" }}
                                >
                                  <Flex
                                    style={{ gap: "2rem" }}
                                    flexDirection="column"
                                  >
                                    <TextField
                                      name="description"
                                      label="Description"
                                      color="secondary"
                                      variant="filled"
                                      required
                                    />

                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <TimePicker
                                        label="Start Time"
                                        value={value}
                                        ampm
                                        onChange={handleChangeTime}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            name="startTime"
                                            color="secondary"
                                            variant="filled"
                                          />
                                        )}
                                      />
                                      <TextField
                                        name="weight"
                                        type="number"
                                        label="Weight"
                                        color="secondary"
                                        variant="filled"
                                        required
                                      />
                                    </LocalizationProvider>
                                    <Box>
                                      <Typography
                                        id="input-slider"
                                        style={{ paddingLeft: "1.2rem" }}
                                      >
                                        Duration(h)
                                      </Typography>
                                      <Slider
                                        name="duration"
                                        aria-label="Temperature"
                                        defaultValue={1}
                                        valueLabelDisplay="on"
                                        color="secondary"
                                        step={1}
                                        marks
                                        min={1}
                                        max={6}
                                      />
                                    </Box>
                                    <Button
                                      type="submit"
                                      variant="contained"
                                      color="secondary"
                                      fullWidth
                                    >
                                      Insert task
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        let column0Items = [
                                          ...columns[0].items,
                                        ];

                                        const tasks =
                                          new WeightedIntervalScheduling(
                                            column0Items
                                          );
                                        tasks.sortTasks();
                                        tasks.computeP();
                                        tasks.ComputeOpt(
                                          column0Items.length - 1
                                        );
                                        tasks.findSolution(
                                          column0Items.length - 1
                                        );

                                        columns[1].items = [
                                          ...columns[1].items,
                                          ...tasks.priorizedTasks,
                                        ].reverse();
                                        setColumns([...columns]);
                                      }}
                                      variant="contained"
                                      fullWidth
                                      style={{ background: "#000080" }}
                                    >
                                      Organize tasks
                                    </Button>
                                  </Flex>
                                </form>
                              </Box>
                            )}
                          </div>
                        );
                      }}
                    </Droppable>
                  </Box>
                </Flex>
              );
            })}
          </DragDropContext>
        </Flex>
      </Box>
    </>
  );
}

export default App;
