# game manager step by step function instead of the run Loop 
def step(self, action_left, action_right):
    # Process actions for both players
    self.apply_action(self.player_left, action_left)
    self.apply_action(self.player_right, action_right)
    # Update game state by one step
    self.ball.move()
    self.handle_collision()
    self.check_score()
    # Prepare return values
    observation = self.get_observation()
    reward_left = self.get_reward(self.player_left)
    reward_right = self.get_reward(self.player_right)
    done = self.is_done()
    return observation, (reward_left, reward_right), done


        # Apply the action to the game via GameManager
        # Return observation, reward, done, and info
        self.game_manager.apply_action(self.game_manager.player_left, action)
        self.game_manager.apply_action(self.game_manager.player_right, action)
        
        observation = self.game_manager.get_observation()
        
        reward_left = self.game_manager.get_reward(self.game_manager.player_left)
        reward_right = self.game_manager.get_reward(self.game_manager.player_right)
        rewards = (reward_left, reward_right)

        done = self.game_manager.is_done()

        info = {}  # Extra info you may want to include

        return observation, rewards, done, info

# then modify the environment to use the step function
def step(self, action_left, action_right):
    observation, (reward_left, reward_right), done = self.game_manager.step(action_left, action_right)
    info = {}
    return observation, (reward_left, reward_right), done, info



"""
		1. game manager should be instantiated in the __init__ function of the environment
 

"""