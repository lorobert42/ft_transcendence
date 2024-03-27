
'''
train_env = PongEnvironment(...)  # Initialize your environment

# Define a Q-Network
q_net = q_network.QNetwork(
    train_env.observation_space,
    train_env.action_space,
    fc_layer_params=(100,)  # Example: One hidden layer with 100 units
)

optimizer = tf.compat.v1.train.AdamOptimizer(learning_rate=1e-3)

train_step_counter = tf.Variable(0)

# Define the DQN agent
agent = dqn_agent.DqnAgent(
    train_env.time_step_spec(),
    train_env.action_spec(),
    q_network=q_net,
    optimizer=optimizer,
    td_errors_loss_fn=common.element_wise_squared_loss,
    train_step_counter=train_step_counter)

agent.initialize()
'''




for e in range(episodes):
    state = env.reset()
    state = np.reshape(state, [1, state_size])
    
    #for time in range(500):  # Maximum time steps per episode
    while not done:

        # Get actions from each player (agent)
        action_left = player_left.decide_action(state)
        action_right = player_right.decide_action(state)

        next_state, reward, done, _ = env.step(action)
        reward = reward if not done else -10  # Adjust based on your scenario
        next_state = np.reshape(next_state, [1, state_size])
        agent.remember(state, action, reward, next_state, done)
        state = next_state
        player_left.update_epsilon()
        player_right.update_epsilon()
        if done:
            print(f"episode: {e}/{episodes}, score: {time}, epsilon: {agent.epsilon}")
            break

observation = env.reset()

done = False
count = 0
while not done:
    action = env.action_space.sample()  # Random action
    observation, reward, done, info = env.step(action)
    env.render()
    count += 1
    if count % 100 == 0:
        print(count)

env.close()
print()
print()
print('Done!')
# Use your environment
observation = env.reset()
for _ in range(1000):
    action = env.action_space.sample()  # Just taking random actions here
    observation, reward, done, info = env.step(action)
    if done:
        observation = env.reset()
env.close()

