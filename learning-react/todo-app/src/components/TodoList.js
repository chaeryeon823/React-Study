import TodoListItem from './TodoListItem';
import './TodoList.scss';
import { List } from 'react-virtualized';
import React, { useCallback } from 'react';

const TodoList = ({ todos, onRemove, onToggle }) => {
  const rowRenderer = useCallback(({ index, key, style }) => {
    const todo = todos[index];
    return (
      <TodoListItem
        todo={todo}
        key={key}
        onRemove={onRemove}
        onToggle={onToggle}
        style={style}
      />
    );
  });
  return (
    <List
      className="TodoList"
      width={512}
      height={513}
      rowCount={todos.length}
      rowHeight={57}
      rowRenderer={rowRenderer}
      List={todos}
      style={{ outline: 'none' }}
    />
  );
};

export default React.memo(TodoList);
