import { Log } from './components/Log';
import { Inspector } from 'react-dev-inspector-enhanced';

export const HomePage = () => {
  return (
    <Inspector
      HOC={{
        name: 'Log',
        importCode: `import { Log } from './components/Log';`,
      }}
      keys={{
        gotoEditor: ['shift', 'command', 's'],
        addHOC: ['command', 'shift', 'l'],
      }}>
      <div>
        <div>
          father
          <Log>
            <div>test1</div>
          </Log>
          <div>test2</div>
          <Log>
            <div>test3</div>
          </Log>
        </div>
      </div>
    </Inspector>
  );
  // return <div>test</div>;
};

export default HomePage;
