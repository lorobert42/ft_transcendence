import numpy as np
import gym
from gym import spaces
import tensorflow as tf
from tf_agents.networks import q_network
from tf_agents.agents.dqn import dqn_agent
from tf_agents.utils import common

from gameManager import GameManager

# Game Constants
WIDTH, HEIGHT = 1000, 700
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125
BALL_RADIUS = 10
FPS = 45

class PongEnvironment(gym.Env):
    """Custom Environment that follows gym interface"""
    metadata = {'render.modes': ['human']}

    def __init__(self, game_manager):
        super(PongEnvironment, self).__init__()
        self.game_manager = game_manager

        # Define action and observation space
        self.action_space = spaces.Discrete(3)  # Up, Down, None

        # Example for using image as input:
        self.observation_space = spaces.Box(low = 0, high = 255, shape = 
                                            (HEIGHT, WIDTH, 3), dtype = np.uint8)

    def step(self, action):
        # Execute one time step within the environment
        # You should integrate your game logic here
        pass

    def reset(self):
        # Reset the state of the environment to an initial state
        pass

    def render(self, mode='human', close=False):
        # Render the environment to the screen
        pass



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
