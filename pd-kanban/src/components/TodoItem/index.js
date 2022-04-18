import { Typography } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Flex } from "reflexbox";
import { Box } from "reflexbox";
import "../../App.css";
const TodoItem = ({ data, index }) => {
  return (
    <Draggable index={index} draggableId={data.id.toString()}>
      {(provided, snapshot) => {
        return (
          <Box
            style={{
              borderRadius: "7px",
            }}
            className="glass"
            marginBottom="0.5rem"
          >
            <Box
              style={{
                userSelect: "none",
                minHeight: "70px",
                padding: "0.5rem",
                color: "white",
                borderRadius: "7px",
                ...provided.draggableProps.style,
              }}
            >
              <Flex justifyContent="space-between">
                <Typography color="white" fontWeight="500">
                  {data.content}
                </Typography>
                <Typography color="black" fontWeight="bold">
                  {data.weight}
                </Typography>
              </Flex>
            </Box>
            <Flex
              justifyContent="space-between"
              padding="0.5rem 0.5rem 0 0.5rem"
              style={{
                borderBottomLeftRadius: "7px",
                borderBottomRightRadius: "7px",
                borderTop: "1px solid #a5ceca",
              }}
            >
              <Typography color="white">{data.startTime}</Typography>-
              <Typography color="white">{data.endTime}</Typography>
            </Flex>
          </Box>
        );
      }}
    </Draggable>
  );
};

export default TodoItem;
