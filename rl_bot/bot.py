# todos: 
# 
# Paddle Movement Boundary Checks: Ensure paddles don't move beyond the game frame
# Ball Movement Boundary Checks: Ensure the ball doesn't move beyond the game frame
# RL algorithms: Q-Learning or Deep Q-Networks (DQN)
# collision is done in the back of the paddle, not the front



# define env interface:
# 
# 1. observation_space: 
	# Position of the ball: The (x, y) coordinates.
	# Velocity of the ball: The change in (x, y) position per time step, which can help predict where the ball will move next.
	# Position of the agent's paddle: The y-coordinate (assuming horizontal movement is fixed).
	# Position of the opponent's paddle: The y-coordinate.

	# observation = [ball_x, ball_y, ball_vel_x, ball_vel_y, paddle_y, opponent_paddle_y]
# 2. Actions:
	# Up: Move the paddle up.
	# Down: Move the paddle down.
	# None: Keep the paddle in its current position.

# 3. Reward:
	# +2  Awarded each time the agent scores a point (i.e., the opponent misses the ball).
	# +1  Awarded each time the agent touches the ball
	# -1  Incurred each time the opponent scores a point (i.e., the agent misses the ball).
	# +0  For all other scenarios not resulting in a score to encourage efficient play without unnecessary movement.

# e
# 
# 


import numpy as np

# Example settings (you'll need to adapt these)
num_states = ... # Define based on your state discretization
num_actions = 3  # Up, Down, No Action
q_table = np.zeros((num_states, num_actions))

# Hyperparameters
learning_rate = 0.1
discount_rate = 0.99
exploration_rate = 1.0
max_exploration_rate = 1.0
min_exploration_rate = 0.01
exploration_decay_rate = 0.001

for episode in range(num_episodes):
    state = env.reset()
    done = False
    
    while not done:
        # Exploration-exploitation trade-off
        if np.random.uniform(0, 1) > exploration_rate:
            action = np.argmax(q_table[state,:])
        else:
            action = env.action_space.sample()  # or a random choice for your game
        
        new_state, reward, done, _ = env.step(action)
        
        # Update Q-table
        q_table[state, action] = q_table[state, action] + learning_rate * (reward + discount_rate * np.max(q_table[new_state, :]) - q_table[state, action])
        
        state = new_state
    
    # Decay exploration rate
    exploration_rate = min_exploration_rate + (max_exploration_rate - min_exploration_rate) * np.exp(-exploration_decay_rate*episode)
