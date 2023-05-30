import "./styles/styles.css";
import Snake from "./components/Snake";
// Design a snake game

const ROWS = 16;
const COLUMNS = 12;

export default function App() {
  return (
    <div className="App">
      <Snake rows={ROWS} columns={COLUMNS} />
    </div>
  );
}
