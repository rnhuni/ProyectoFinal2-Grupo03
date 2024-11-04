from ..models.model import session
from ..models.active_subscription import ActiveSubscription, ActiveSubscriptionFeature
from .base_command import BaseCommannd

class CreateActiveSubscription(BaseCommannd):
    def __init__(self, client_id, base_subscription, features, notify_by_email):
        self.client_id = client_id
        self.base_subscription = base_subscription
        self.features = features
        self.notify_by_email = notify_by_email
    
    def execute(self):
        if not self.client_id or not self.base_subscription or not self.features or\
            not self.notify_by_email:
            raise ValueError("Invalid data provided")
        
        price = float(self.base_subscription["price"])
        for feature in self.features:
            price += float(feature["price"])

        try:
            plan = ActiveSubscription(self.client_id, self.base_subscription["id"], self.base_subscription["name"],\
                                      self.base_subscription["description"], price, "request_open", self.notify_by_email)
            session.add(plan)
            session.flush()

            for feature in self.features:
                plan_feature = ActiveSubscriptionFeature(
                    plan_id=plan.id,
                    feature_id=feature["id"],
                    feature_name=feature["name"],
                    feature_price=feature["price"],
                )
                session.add(plan_feature)

            session.commit()

            return plan
        except Exception as e:
            session.rollback()
            raise e