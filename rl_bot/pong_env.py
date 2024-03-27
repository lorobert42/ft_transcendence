import numpy as np
import gym
from gym import spaces
import tensorflow as tf
from tf_agents.networks import q_network
from tf_agents.agents.dqn import dqn_agent
from tf_agents.utils import common

# Game Constants
WIDTH, HEIGHT = 1000, 700
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125
BALL_RADIUS = 10
FPS = 45

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

        

class PongEnv(gym.Env):
    """Custom Pong environment that follows the Gym interface"""
    metadata = {'render.modes': ['human']}

    def __init__(self):
        super(PongEnv, self).__init__()

        from gameManager import GameManager

        #  Action space: 0 = stay, 1 = up, 2 = down
        self.action_space = spaces.Discrete(3)

        # Using vector as input
        self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(6,), dtype=np.float32)

        # Initialize DQN models for both players
        self.state_size = self.observation_space.shape[0]
        self.action_size = self.action_space.n

        self.game_manager = GameManager(player1_type='rl', player2_type='rl')


    def step(self, actions):
        action_left, action_right = actions
        observation, (reward_left, reward_right), done = self.game_manager.step(action_left, action_right)
        info = {}
        return observation, (reward_left, reward_right), done, info

        

    def reset(self):
        # Reset the game to an initial state via GameManager
        self.game_manager.reset_game()
        
        return self.game_manager.get_observation()


    def render(self, mode='human', close=False):
        # No visual representation
        pass

    def close(self):
        pass
