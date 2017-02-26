/**
 * Created by Nick on 2/14/2017.
 */


export enum ContestStates {
  /**
   * When the manager has started creating a contest, but is not finished yet
   */
  INITIALIZING = 10,
  /**
   * When the manager has completed setting up the contest
   */
  CREATED = 20,
  /**
   * When the payment is being process, but the contest has been created
   */
  PENDING_PAYMENT = 30,
  /**
   * When the contest is waiting for members to fill it
   */
  PENDING_FILLED = 40,
  /**
   * When the contest is filled, but hasn't started yet
   */
  FILLED = 50,
  /**
   * When the contest has started but isnt completed yet
   */
  IN_PROGRESS = 60,
  /**
   * When the contest is completed and payouts can be designated by the manager
   */
  COMPLETED = 70,
  /**
   * When the payouts have been designated by the manager
   */
  PAYOUTS_DESIGNATED = 80,
  /**
   * When payouts are in the process of being completed
   */
  PAYOUTS_COMPLETED = 90,
  /**
   * When payouts are completed and the contest is over
   */
  CLOSED = 100

}
