import { Inspector } from 'react-dev-inspector-enhanced';

export const HomePage = () => {
  return (
    <Inspector
      keys={['shift', 'command', 's']}
      disableLaunchEditor={false}
      tt="33l"
    />
  );
  // return <div>test</div>;
};

export default HomePage;
