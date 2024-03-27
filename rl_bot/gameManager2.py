import pygame
import sys
import random
import numpy as np
import gym
from gym import spaces
import tensorflow as tf
from tf_agents.networks import q_network
from tf_agents.agents.dqn import dqn_agent
from tf_agents.utils import common

from tensorflow.keras import layers
from collections import deque

# Initialize pygame
pygame.init()

# Game Constants
WIDTH, HEIGHT = 1000, 700
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125
BALL_RADIUS = 10
FPS = 45

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

BATCH_SIZE = 32  # Define batch size as a constant or a hyperparameter


import os
import sys

# Redirect standard output
sys.stdout = open(os.devnull, 'w')

class Ball:
    def __init__(self, x, y, radius, vel_x=5, vel_y=5):
        self.x = x
        self.y = y
        self.radius = radius
        self.vel_x = vel_x
        self.vel_y = vel_y

    def move(self):
        self.x += self.vel_x
        self.y += self.vel_y

    def draw(self, screen):
        pygame.draw.circle(screen, WHITE, (self.x, self.y), self.radius)

    def reset(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.vel_x *= -1
        self.vel_y = 5

class Paddle:
    """Paddle class"""
    def __init__(self, x, y, width, height, vel=10):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.vel = vel
        self.initial_x = x
        self.initial_y = y

    def reset(self):
        # Reset the paddle's position to its initial state
        self.x = self.initial_x
        self.y = self.initial_y
        # Reset any other attributes to their initial values here

    def move(self, up=True):
        if up and self.y > 0:
            self.y -= self.vel
        elif not up and self.y < HEIGHT - self.height: # check paddle doesn't go off screen
            self.y += self.vel

    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, (self.x, self.y, self.width, self.height))




tf.get_logger().setLevel('ERROR')




class Player:
    
    def __init__(self, control_side, player_type='human', model=None, epsilon=1.0, epsilon_decay=0.995, epsilon_min=0.01):
        self.control_side = control_side  # 'left' or 'right'
        self.player_type = player_type  # 'human' or 'rl'
        self.model = model  # DQN model
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = epsilon_min

        self.action = None  # Action chosen by the left player (up, down, none)

    def decide_action(self, observation=None, keys=None):
        if self.player_type == 'human':
            if self.control_side == 'left':
                if keys[pygame.K_w]:
                    return 'up'
                elif keys[pygame.K_s]:
                    return 'down'
            elif self.control_side == 'right':
                if keys[pygame.K_UP]:
                    return 'up'
                elif keys[pygame.K_DOWN]:
                    return 'down'
            return 'none'
        elif self.player_type == 'rl':
            """
            if np.random.rand() < self.epsilon:  # epsilon is your exploration rate, which you decrease over time
                # Exploration: random action
                return random.choice(["none", "up", "down"])
            """
            #else:
                # Exploitation: Use the DQN model to choose the best action
            observation_reshaped = np.reshape(observation, [1, -1])  # Ensure the observation shape matches what the model expects
            q_values = self.model.predict(observation_reshaped)
            action = np.argmax(q_values[0])
                
            # Translate numerical action to your environment's action space
            actions_dict = {0: "none", 1: "up", 2: "down"}
            return actions_dict[action]

    def update_epsilon(self):
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)


class GameManager:
    def __init__(self, player1_type = 'human', player2_type = 'human', model_left=None, model_right=None):
        self.ball = Ball(WIDTH // 2, HEIGHT // 2, BALL_RADIUS)
        self.paddle_left = Paddle(20, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.score_left = 0
        self.score_right = 0
        self.last_score_left = 0  # Initialize last score for left player
        self.last_score_right = 0  # Initialize last score for right player
        self.hit_paddle = False  # Flag to track if the ball hit a paddle
        self.frames_since_last_observation = FPS  # Track frames to match action frequency, init to FPS for first observation
        
        self.observation = self.get_observation()  # Initialize observation
        # Instantiate players with specified types and potentially models for RL players
        self.player_left = Player('left', player1_type, model=model_left)
        self.player_right = Player('right', player2_type, model=model_right)
        #self.player_left = Player('left', 'rl', model=player_left_model)
        #self.player_right = Player('right', 'rl', model=player_right_model)

        self.players = [self.player_left, self.player_right]

    def run(self):
        screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Pong")
        clock = pygame.time.Clock()
        running = True
        action = None  # Action chosen by the player (up, down, none)
        frames_since_last_observation = FPS  # Track frames to match action frequency, init to FPS for first observation

        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

            keys = pygame.key.get_pressed()  # Get pressed keys for human players
            
            # Update observation every second
            if frames_since_last_observation >= FPS:  # Time to update action
                observation = self.get_observation()
                frames_since_last_observation = 0
            
            # Decide actions for both players and update paddles
            for player in self.players:
                if player.player_type == 'human':
                    action = player.decide_action(keys=keys)
                elif player.player_type == 'rl':
                    action = player.decide_action(observation=observation)
                observation[5] = self.paddle_left.y / HEIGHT
                observation[4] = self.paddle_right.y / HEIGHT

                self.apply_action(player, action)

            frames_since_last_observation += 1
            self.ball.move()
            self.handle_collision()
            #('checking score')
            self.check_score()

            screen.fill(BLACK)
            self.ball.draw(screen)
            self.paddle_left.draw(screen)
            self.paddle_right.draw(screen)
            pygame.display.flip()
            clock.tick(FPS)

        pygame.quit()
        sys.exit()

    def get_observation(self):
        # This is sent once per second to the RL agent
        # Data is normalized for the dynamic frame sizes
        observation = [self.ball.x / WIDTH, self.ball.y / HEIGHT, self.ball.vel_x, self.ball.vel_y, self.paddle_right.y / HEIGHT, self.paddle_left.y / HEIGHT]
        return (observation)

    def apply_action(self, player, action):
        # This could be similar to how you handle human key presses
        # Apply the given action to the appropriate paddle
        paddle = self.paddle_left if player.control_side == 'left' else self.paddle_right
        if action == 'up':
            paddle.move(up=True)
        elif action == 'down':
            paddle.move(up=False)



    def get_reward(self, player):
        reward = 0

        # Check who hit the ball
        if self.hit_paddle:
            if (self.ball.vel_x < 0 and player == self.player_right) or \
            (self.ball.vel_x > 0 and player == self.player_left):
                # Reward for hitting the opponent's paddle
                reward = 1

        # Additional reward for scoring
        if player == self.player_left and self.score_left > self.last_score_left:
            reward += 2  # Left player scores
            self.last_score_left = self.score_left
        elif player == self.player_right and self.score_right > self.last_score_right:
            reward += 2  # Right player scores
            self.last_score_right = self.score_right

        # Penalty if the opponent scores
        if player == self.player_left and self.score_right > self.last_score_right:
            reward -= 1  # Penalty for right player scoring against left player
            self.last_score_right = self.score_right
        elif player == self.player_right and self.score_left > self.last_score_left:
            reward -= 1  # Penalty for left player scoring against right player
            self.last_score_left = self.score_left

        # Reset hit_paddle flag after calculating reward
        self.hit_paddle = False

        return reward

    def is_done(self):
        # Example condition: game ends when a player reaches a score of 10
        max_score = 5
        if self.score_left >= max_score or self.score_right >= max_score:
            return True
        return False

    def handle_collision(self):
        self.hit_paddle = False

        """ Change the ball direction if it hit the ceiling """
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= HEIGHT:
            self.ball.vel_y *= -1  # Bounce off the wall

        # Collision with the left paddle
        if self.ball.vel_x < 0:  # Ball moving left
            
            # Ball goes left to right ->
            if self.paddle_left.x + self.paddle_left.width >= self.ball.x - self.ball.radius and \
            self.paddle_left.y <= self.ball.y <= self.paddle_left.y + self.paddle_left.height:
            
                # Ball is hitting the left_paddle
                if self.ball.x > self.paddle_left.x:  # Ensure collision is at the front of paddle
                    self.hit_paddle = True

                    # Reverse horizontal velocity
                    self.ball.vel_x *= -1  

                    # Calculate vertical velocity adjustment
                    difference_in_y = (self.paddle_left.y + self.paddle_left.height / 2) - self.ball.y
                    
                    # Will change the velocity of the ball depending of where the
                    # Ball is hitting the paddle
                    self.ball.vel_y = -difference_in_y / 10  # sensitivity of the bounce

        # Collision with the right paddle
        if self.ball.vel_x > 0:  # Ball moving right
            
            if self.paddle_right.x <= self.ball.x + self.ball.radius and \
            self.paddle_right.y <= self.ball.y <= self.paddle_right.y + self.paddle_right.height:
            
                if self.ball.x < self.paddle_right.x + self.paddle_right.width:  # Ensure collision is at the front of paddle
                    self.hit_paddle = True

                    # Reverse horizontal velocity
                    self.ball.vel_x *= -1 
                    
                    # Calculate vertical velocity adjustment
                    difference_in_y = (self.paddle_right.y + self.paddle_right.height / 2) - self.ball.y
                    
                    # Will change the velocity of the ball depending of where the
                    # Ball is hitting the paddle
                    self.ball.vel_y = -difference_in_y / 10  # sensitivity of the bounce

    def reset_game(self):
        # Reset game to initial state
        self.ball.reset()
        self.paddle_left.reset()
        self.paddle_right.reset()
        self.score_left = 0
        self.score_right = 0
        self.last_score_left = 0
        self.last_score_right = 0
        self.hit_paddle = False
        self.observation = self.get_observation()

    def check_score(self):
        if self.ball.x < 0:
            self.score_right += 1
            self.ball.reset()
        elif self.ball.x > WIDTH:
            self.score_left += 1
            self.ball.reset()
        print(f"Score - Left: {self.score_left}, Right: {self.score_right}", end='\r') #, flush=True)
      

    # game manager step by step function instead of the run Loop 
    def step(self, action_left, action_right):
        # Process actions for both players
        self.apply_action(self.player_left, action_left)
        self.apply_action(self.player_right, action_right)
        
        # Update game state by one step
        self.ball.move()
        self.handle_collision()
        self.check_score()
        
        self.frames_since_last_observation += 1
        if self.frames_since_last_observation >= FPS:
            self.observation = self.get_observation()  # Update observation
            self.frames_since_last_observation = 0 
        self.observation[5] = self.paddle_left.y / HEIGHT
        self.observation[4] = self.paddle_right.y / HEIGHT

        # Prepare return values
        reward_left = self.get_reward(self.player_left)
        reward_right = self.get_reward(self.player_right)
        done = self.is_done()
        return self.observation, (reward_left, reward_right), done






class DQNAgent:
    def __init__(self, state_size, action_size, load_model=False):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = deque(maxlen=2000)  # Experience replay buffer
        self.gamma = 0.95  # Discount rate
        
        # High epsilon encourages exploration
        # Low epsilon encourages exploitation
        # Epsilon decay encourages exploitation over time
        self.epsilon = 0.6  # Exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        
        self.learning_rate = 0.005
        
        if load_model is not None:
            self.model = load_model  # If a model is passed, use it
        else:
            self.model = self._build_model()  # Otherwise, build a new model

        #self.model = self._build_model()

    def _build_model(self):
        # Neural Net for Deep-Q learning Model
        model = tf.keras.Sequential()
        model.add(layers.Dense(24, input_dim=self.state_size, activation='relu'))
        model.add(layers.Dense(24, activation='relu'))
        model.add(layers.Dense(self.action_size, activation='linear'))
        model.compile(loss='mse', optimizer=tf.keras.optimizers.Adam(lr=self.learning_rate))
        return model

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def act(self, state):
        # Epsilon-greedy action selection
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)
        state_reshaped = np.array(state).reshape(1, -1)
        act_values = self.model.predict(state_reshaped)
        return np.argmax(act_values[0])  # returns action

    def replay(self, batch_size):
        minibatch = random.sample(self.memory, batch_size)
        for state, action, reward, next_state, done in minibatch:
            # Ensure state and next_state have the correct shape
            next_state = np.array(next_state).reshape(1, -1)
            state = np.array(state).reshape(1, -1)
            
            target = reward
            if not done:
                target = (reward + self.gamma * np.amax(self.model.predict(next_state)[0]))
            target_f = self.model.predict(state)
            target_f[0][action] = target
            self.model.fit(state, target_f, epochs=1, verbose=0)
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay
    def save(self, filename):
        self.model.save(filename)




from simple_colors import *

print(red("Hello, World!"))

from gym.envs.registration import register
from tensorflow.keras.models import load_model
#agent_left = load_model('left_agent.h5')
#agent_right = load_model('right_agent.h5')
register(
    id='PongCustom-v0',  # Use an ID that uniquely identifies your environment
    entry_point='pong_env:PongEnv',  # This is in the format 'module_name:ClassName'
)

# Restore standard output
#sys.stdout = sys.__stdout__

import time
"""
def main():
    sys.stdout = open(os.devnull, 'w')
    # Initialize the environment
    env = gym.make('PongCustom-v0')

    episodes = 200


    # train v0
    #agent_left = DQNAgent(env.state_size, env.action_size)
    #agent_right = DQNAgent(env.state_size, env.action_size)
    
    # train v1
    #model_left = load_model('v0_left_agent.h5')
    #model_right = load_model('v0_right_agent.h5')

    # train v2
    #model_left = load_model('v1_left_agent.h5')
    #model_right = load_model('v1_right_agent.h5')

    # train v2
    model_left = load_model('v2_left_agent.h5')
    model_right = load_model('v2_right_agent.h5')

    agent_left = DQNAgent(env.state_size, env.action_size, model_left)
    agent_right = DQNAgent(env.state_size, env.action_size, model_right)

    start_time = time.time()
    new_time = time.time()
    for e in range(episodes):
        
        state = env.reset() # Reset the environment to the initial state
        done = False
        
        while not done:
            action_left = agent_left.act(state)
            action_right = agent_right.act(state)
            #print(action_left, action_right)

            actions = (action_left, action_right)
            next_state, reward, done, info = env.step(actions)

            # Update models/agents with experiences - specifics depend on your implementation
            agent_left.remember(state, action_left, reward[0], next_state, done)
            agent_right.remember(state, action_right, reward[1], next_state, done)

            state = next_state
            if done:
                # Method to sample from memory and learn 
                if len(agent_left.memory) > 32:
                    agent_left.replay(BATCH_SIZE)
                    agent_right.replay(BATCH_SIZE)
                sys.stdout = sys.__stdout__
                elapsed_time = time.time() - start_time
                epoch_time = time.time() - new_time
                print()
                print(green(f"Episode: {e+1}/{episodes} completed.", ['bold', 'underlined']))

                new_time = time.time()
                
                estimated_remaining_time1 = (episodes - e) * epoch_time
                min_remaining1 = round(estimated_remaining_time1 // 60, 2)

                estimated_remaining_time2 = episodes * elapsed_time / (e+1)
                min_remaining2 = round(estimated_remaining_time2 // 60, 2)
                print("Elapsed Time:")
                print("Total:\t\t", blue(f"{round(elapsed_time, 0)}"), " \t and epoch: ", blue(f"{round(epoch_time, 0)}"), " seconds")
                print("Estimated remaining time:")
                print("Between\t", blue(f"{min_remaining1}"), "and ", blue(f"{min_remaining2}"), " minutes")
                print()
                sys.stdout = open(os.devnull, 'w')
                break

    agent_left.save('v3_left_agent.h5')
    agent_right.save('v3_right_agent.h5')

if __name__ == '__main__':
    main()



"""














def main():
    agent_left = load_model('v1_left_agent.h5')
    agent_right = load_model('v1_right_agent.h5')

    """ TESTING GAME """
    # Human vs Human
    game_human_vs_human = GameManager(player1_type='human', player2_type='human', model_left=None, model_right=None)
    game_human_vs_human.run()


    # RL vs Human
    game_rl_vs_human = GameManager(player1_type='rl', player2_type='human', model_left=agent_left, model_right=None)
    game_rl_vs_human.run()
    """ TESTING AGENTS """
    # Human vs RL
    game_human_vs_rl = GameManager(player1_type='human', player2_type='rl', model_left=None, model_right=agent_left)
    game_human_vs_rl.run()

    """ TRAINING AGENTS """
    game_rl_vs_rl = GameManager(player1_type='rl', player2_type='rl', model_left=agent_left, model_right=agent_right)
    game_rl_vs_rl.run()
    
    """ TESTING AGENTS """
    # Human vs RL
    game_human_vs_rl = GameManager(player1_type='human', player2_type='rl', model_left=None, model_right=agent_left)
    game_human_vs_rl.run()

    """ TESTING GAME """
    # Human vs Human
    game_human_vs_human = GameManager(player1_type='human', player2_type='human', model_left=None, model_right=None)
    game_human_vs_human.run()

#    game = GameManager()
#    game.run()

if __name__ == '__main__':
    main()

