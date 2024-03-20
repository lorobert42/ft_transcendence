import pygame
import sys
import random

# Initialize pygame
pygame.init()

# Game Constants
WIDTH, HEIGHT = 1000, 700
PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125
BALL_RADIUS = 10
FPS = 20

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

class Ball:
    def __init__(self, x, y, radius, max_vel_x=10, max_vel_y=15):
        self.x = x
        self.y = y
        self.radius = radius
        self.max_vel_x = max_vel_x
        self.max_vel_y = max_vel_y

    def move(self):
        self.x += self.max_vel_x
        self.y += self.max_vel_y

    def draw(self, screen):
        pygame.draw.circle(screen, WHITE, (self.x, self.y), self.radius)

    def reset(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.max_vel_x *= -1
        self.max_vel_y = 5

class Paddle:
    """Paddle class"""
    def __init__(self, x, y, width, height, vel=10):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.vel = vel

    def move(self, up=True):
        if up and self.y > 0:
            self.y -= self.vel
        elif not up and self.y < HEIGHT - self.height: # check paddle doesn't go off screen
            self.y += self.vel

    def draw(self, screen):
        pygame.draw.rect(screen, WHITE, (self.x, self.y, self.width, self.height))








class Player:
    def __init__(self, control_side, player_type='human'):
        self.control_side = control_side  # 'left' or 'right'
        self.player_type = player_type  # 'human' or 'rl'
        self.action = None  # Action chosen by the left player (up, down, none)
        self.action = None  # Action chosen by the right player (up, down, none)
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
            if self.control_side == 'left':
                directions = ["none", "up", "down"]
                return random.choice(directions)
            elif self.control_side == 'right':
                directions = ["none", "up", "down"]
                return random.choice(directions)
            # Placeholder for RL agent decision-making logic
            # This will use the observation to decide an action
            # For example: return self.rl_agent.decide_action(observation)
            pass


class GameManager:
    def __init__(self, player1_type = 'human', player2_type = 'human'):
        self.ball = Ball(WIDTH // 2, HEIGHT // 2, BALL_RADIUS)
        self.paddle_left = Paddle(20, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.paddle_right = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.score_left = 0
        self.score_right = 0
        
        # Instantiate players with specified types
        self.player_left = Player('left', player1_type)
        self.player_right = Player('right', player2_type)
        self.players = [self.player_left, self.player_right]

    def run(self, mode='human'):
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
                self.apply_action(player, action)

            frames_since_last_observation += 1
            self.ball.move()
            self.handle_collision()
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
        # Construct and return the current state observation
        # This is sent once per second to the RL agent
        observation = [self.ball.x, self.ball.y, self.ball.x, self.ball.y, self.paddle_right.y, self.paddle_left.y]
        return (observation)

    def apply_action(self, player, action):
        # This could be similar to how you handle human key presses
        # Apply the given action to the appropriate paddle
        paddle = self.paddle_left if player.control_side == 'left' else self.paddle_right
        if action == 'up':
            paddle.move(up=True)
        elif action == 'down':
            paddle.move(up=False)





    def handle_collision(self):
        """ Change the ball direction if it hit the ceiling """

        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= HEIGHT:
            self.ball.max_vel_y *= -1 # Changed x to y

        if self.ball.max_vel_x < 0:
            # Ball goes left to right ->
            if self.paddle_left.x + self.paddle_left.width >= self.ball.x - self.ball.radius and \
            self.paddle_left.y <= self.ball.y <= self.paddle_left.y + self.paddle_left.height:
                # Ball is hitting the left_paddle
                if self.ball.x > self.paddle_left.x:  # Ensure collision is at the front of paddle
                    self.ball.max_vel_x *= -1

                    # Calculate vertical velocity adjustment
                    difference_in_y = (self.paddle_right.y + self.paddle_right.height / 2) - self.ball.y
                    reduction_factor = (self.paddle_right.height / 2) / self.ball.max_vel_y
                    self.ball.vel_y = difference_in_y / reduction_factor
                    # Will change the velocity of the ball depending of where the
                    # Ball is hitting the paddle

        if self.ball.max_vel_x > 0:  # Ball moving right
            # Ball goes right to left <-
            if self.paddle_right.x <= self.ball.x + self.ball.radius and \
            self.paddle_right.y <= self.ball.y <= self.paddle_right.y + self.paddle_right.height:
                # Ball is hitting the rigth_paddle
                if self.ball.x < self.paddle_right.x + self.paddle_right.width:  # Ensure collision is at the front of paddle
                    self.ball.max_vel_x *= -1

                    # Calculate vertical velocity adjustment
                    difference_in_y = (self.paddle_left.y + self.paddle_left.height / 2) - self.ball.y
                    reduction_factor = (self.paddle_left.height / 2) / self.ball.max_vel_y
                    self.ball.vel_y = difference_in_y / reduction_factor
                    # Will change the velocity of the ball depending of where the
                    # Ball is hitting the paddle

    def check_score(self):
        if self.ball.x < 0:
            self.score_right += 1
            self.ball.reset()
        elif self.ball.x > WIDTH:
            self.score_left += 1
            self.ball.reset()
        print(f"Score - Left: {self.score_left}, Right: {self.score_right}", end='\r', flush=True)
        

# Main function
if __name__ == "__main__":
    

    """ TESTING GAME """
    # Human vs Human
    game_human_vs_human = GameManager(player1_type='human', player2_type='human')
    game_human_vs_human.run()

    """ TRAINING AGENTS """
    game_rl_vs_rl = GameManager(player1_type='rl', player2_type='rl')
    game_rl_vs_rl.run()
    
    """ TESTING AGENTS """
    # Human vs RL
    game_human_vs_rl = GameManager(player1_type='human', player2_type='rl')
    game_human_vs_rl.run()

    # RL vs Human
    game_rl_vs_human = GameManager(player1_type='rl', player2_type='human')
    game_rl_vs_human.run()

    """ TESTING GAME """
    # Human vs Human
    game_human_vs_human = GameManager(player1_type='human', player2_type='human')
    game_human_vs_human.run()

#    game = GameManager()
#    game.run()
