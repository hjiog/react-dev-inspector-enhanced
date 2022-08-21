import { describe, expect, it } from 'vitest';
import { transfer } from '../src/plugins/webpack/addHOC';

const text = `import { Inspector } from 'react-dev-inspector-enhanced';

export const HomePage = () => {
  return (
    <Inspector
      HOC={{
        name: 'Log',
        importCode: "import { Log } from './components/Log';",
      }}
      keys={{
        gotoEditor: ['shift', 'command', 's'],
        addHOC: ['command', 'shift', 'l'],
      }}>
      <div>
        <div>
          father
          <div>test1</div>
          <div>test2</div>
          <div>test3</div>
        </div>
      </div>
    </Inspector>
  );
  // return <div>test</div>;
};

export default HomePage;
`;

describe('should transfer correct', () => {
  it('has not imported, lineNumber: 5, colNumber: 4', () => {
    const res = transfer({
      text,
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 5,
      colNumber: 4,
    });
    expect(res).toMatchInlineSnapshot(`
      "import { Log } from './components/Log';
      import { Inspector } from 'react-dev-inspector-enhanced';

      export const HomePage = () => {
        return (
          <Log><Inspector
            HOC={{
              name: 'Log',
              importCode: \\"import { Log } from './components/Log';\\",
            }}
            keys={{
              gotoEditor: ['shift', 'command', 's'],
              addHOC: ['command', 'shift', 'l'],
            }}>
            <div>
              <div>
                father
                <div>test1</div>
                <div>test2</div>
                <div>test3</div>
              </div>
            </div>
          </Inspector></Log>
        );
        // return <div>test</div>;
      };

      export default HomePage;
      "
    `);
  });
  it('has not imported, lineNumber: 10, colNumber: 17', () => {
    const res = transfer({
      text,
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 17,
      colNumber: 10,
    });
    expect(res).toMatchInlineSnapshot(`
      "import { Log } from './components/Log';
      import { Inspector } from 'react-dev-inspector-enhanced';

      export const HomePage = () => {
        return (
          <Inspector
            HOC={{
              name: 'Log',
              importCode: \\"import { Log } from './components/Log';\\",
            }}
            keys={{
              gotoEditor: ['shift', 'command', 's'],
              addHOC: ['command', 'shift', 'l'],
            }}>
            <div>
              <div>
                father
                <Log><div>test1</div></Log>
                <div>test2</div>
                <div>test3</div>
              </div>
            </div>
          </Inspector>
        );
        // return <div>test</div>;
      };

      export default HomePage;
      "
    `);
  });
  it('has been imported, lineNumber: 10, colNumber: 17', () => {
    const res = transfer({
      text: `import { Log } from './components/Log';\n` + text,
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 6,
      colNumber: 4,
    });
    expect(res).toMatchInlineSnapshot(`
      "import { Log } from './components/Log';
      import { Inspector } from 'react-dev-inspector-enhanced';

      export const HomePage = () => {
        return (
          <Log><Inspector
            HOC={{
              name: 'Log',
              importCode: \\"import { Log } from './components/Log';\\",
            }}
            keys={{
              gotoEditor: ['shift', 'command', 's'],
              addHOC: ['command', 'shift', 'l'],
            }}>
            <div>
              <div>
                father
                <div>test1</div>
                <div>test2</div>
                <div>test3</div>
              </div>
            </div>
          </Inspector></Log>
        );
        // return <div>test</div>;
      };

      export default HomePage;
      "
    `);
  });
  it('not transform', () => {
    const res = transfer({
      text: '<Log><div>test</div></Log>',
      componentName: 'Log',
      importCode: `import { Log } from './components/Log';`,
      lineNumber: 1,
      colNumber: 0,
    });
    expect(res).toMatchInlineSnapshot('false');
  });
});
